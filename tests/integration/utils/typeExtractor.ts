import path from 'node:path';
import * as ts from 'typescript';
import { SchemaBuilder } from '../../../src/generator/SchemaBuilder';
import { TypeParser, type TypeInfo } from '../../../src/generator/TypeParser';
import type { FormSchema } from '../../../src/types/FormSchema';

interface BuildSchemaFromTypeOptions {
	typeId: string;
	typeName: string;
	sourcePath: string;
	schemaOptions?: Parameters<typeof SchemaBuilder.buildSchema>[2];
}

interface ConversionContext {
	declarations: Map<string, ts.Node>;
	resolving: Set<string>;
}

export function buildSchemaFromType(options: BuildSchemaFromTypeOptions): FormSchema {
	const absolutePath = path.resolve(options.sourcePath);
	const rootType = loadTypeInfo(absolutePath, options.typeName);

	if (rootType.kind !== 'object' || !rootType.properties) {
		throw new Error(`Type "${options.typeName}" must describe an object shape.`);
	}

	const fields = Object.entries(rootType.properties).map(([propName, typeInfo]) =>
		TypeParser.parseType(propName, typeInfo)
	);

	return SchemaBuilder.buildSchema(options.typeId, fields, options.schemaOptions);
}

function loadTypeInfo(sourcePath: string, typeName: string): TypeInfo {
	const program = ts.createProgram([sourcePath], {
		target: ts.ScriptTarget.ESNext,
		module: ts.ModuleKind.ESNext,
		moduleResolution: ts.ModuleResolutionKind.NodeNext,
		jsx: ts.JsxEmit.ReactJSX,
		strictNullChecks: true,
		skipLibCheck: true,
		allowSyntheticDefaultImports: true,
		allowNonTsExtensions: true,
	});

	const sourceFile = program.getSourceFile(sourcePath);
	if (!sourceFile) {
		throw new Error(`Unable to read TypeScript source at ${sourcePath}`);
	}

	const declarations = collectDeclarations(sourceFile);
	const declaration = declarations.get(typeName);
	if (!declaration) {
		throw new Error(`Type "${typeName}" not found in ${sourcePath}`);
	}

	const context: ConversionContext = {
		declarations,
		resolving: new Set<string>(),
	};

	return convertDeclarationToTypeInfo(declaration, context, typeName);
}

function collectDeclarations(sourceFile: ts.SourceFile): Map<string, ts.Node> {
	const map = new Map<string, ts.Node>();

	const visit = (node: ts.Node) => {
		if (
			ts.isInterfaceDeclaration(node) ||
			ts.isTypeAliasDeclaration(node) ||
			ts.isClassDeclaration(node) ||
			ts.isEnumDeclaration(node)
		) {
			if (node.name) {
				map.set(node.name.text, node);
			}
		}
		ts.forEachChild(node, visit);
	};

	visit(sourceFile);
	return map;
}

function convertDeclarationToTypeInfo(node: ts.Node, context: ConversionContext, fallbackName?: string): TypeInfo {
	if (ts.isInterfaceDeclaration(node)) {
		return {
			kind: 'object',
			name: node.name?.text || fallbackName,
			properties: buildMembers(node.members, context),
		};
	}

	if (ts.isClassDeclaration(node)) {
		return {
			kind: 'object',
			name: node.name?.text || fallbackName,
			properties: buildMembers(node.members, context),
		};
	}

	if (ts.isTypeAliasDeclaration(node)) {
		return convertTypeNode(node.type, context, fallbackName);
	}

	if (ts.isEnumDeclaration(node)) {
		return {
			kind: 'enum',
			enumValues: node.members.map(member => {
				const name = member.name.getText();
				const rawValue = member.initializer && ts.isLiteralExpression(member.initializer)
					? extractLiteral(member.initializer)
					: name;
				return {
					value: rawValue,
					label: formatLabel(String(rawValue)),
				};
			}),
		};
	}

	throw new Error(`Unsupported declaration kind: ${ts.SyntaxKind[node.kind]}`);
}

function buildMembers(
	members: ts.NodeArray<ts.TypeElement | ts.ClassElement>,
	context: ConversionContext
): Record<string, TypeInfo> {
	const props: Record<string, TypeInfo> = {};

	for (const member of members) {
		if (!isPropertyLike(member)) {
			continue;
		}

		const propName = getPropertyName(member.name);
		if (!propName) {
			continue;
		}

		const memberType = member.type ? convertTypeNode(member.type, context) : { kind: 'string' };
		const required = !member.questionToken;
		const readonly = hasReadonlyModifier(member);

		props[propName] = {
			...memberType,
			required,
			readonly,
		};
	}

	return props;
}

function convertTypeNode(node: ts.TypeNode, context: ConversionContext, typeAliasName?: string): TypeInfo {
	switch (node.kind) {
		case ts.SyntaxKind.StringKeyword:
			return { kind: 'string' };
		case ts.SyntaxKind.NumberKeyword:
			return { kind: 'number' };
		case ts.SyntaxKind.BooleanKeyword:
			return { kind: 'boolean' };
	}

	if (ts.isTypeLiteralNode(node)) {
		return {
			kind: 'object',
			name: typeAliasName,
			properties: buildMembers(node.members, context),
		};
	}

	if (ts.isArrayTypeNode(node)) {
		return {
			kind: 'array',
			elementType: convertTypeNode(node.elementType, context),
		};
	}

	if (ts.isTypeReferenceNode(node)) {
		const typeName = node.typeName.getText();

		if (typeName === 'Array' && node.typeArguments?.length === 1) {
			return {
				kind: 'array',
				elementType: convertTypeNode(node.typeArguments[0], context),
			};
		}

		if (typeName === 'Date') {
			return { kind: 'date' };
		}

		const declaration = context.declarations.get(typeName);
		if (declaration) {
			if (context.resolving.has(typeName)) {
				return {
					kind: 'object',
					name: typeName,
				};
			}

			context.resolving.add(typeName);
			const result = convertDeclarationToTypeInfo(declaration, context, typeName);
			context.resolving.delete(typeName);
			return result;
		}

		return { kind: 'string' };
	}

	if (ts.isUnionTypeNode(node)) {
		const literalMembers = node.types.filter(isLiteralTypeNode);
		if (literalMembers.length === node.types.length) {
			return {
				kind: 'enum',
				enumValues: literalMembers.map(literalType => {
					const literalValue = extractLiteral(literalType.literal);
					return {
						value: literalValue,
						label: formatLabel(String(literalValue)),
					};
				}),
			};
		}

		return {
			kind: 'union',
			unionVariants: node.types.map((variant, index) => ({
				...convertTypeNode(variant, context),
				name: `variant${index}`,
			})),
		};
	}

	if (isLiteralTypeNode(node)) {
		const literalValue = extractLiteral(node.literal);
		return {
			kind: 'enum',
			enumValues: [
				{
					value: literalValue,
					label: formatLabel(String(literalValue)),
				},
			],
		};
	}

	if (ts.isTemplateLiteralTypeNode(node)) {
		return {
			kind: 'template-literal',
			templatePattern: buildTemplatePattern(node),
		};
	}

	return { kind: 'string' };
}

function isPropertyLike(node: ts.Node): node is ts.PropertySignature | ts.PropertyDeclaration {
	return ts.isPropertySignature(node) || ts.isPropertyDeclaration(node);
}

function getPropertyName(name: ts.PropertyName | undefined): string | null {
	if (!name) {
		return null;
	}
	if (ts.isIdentifier(name) || ts.isStringLiteral(name) || ts.isNumericLiteral(name)) {
		return name.text;
	}
	return null;
}

function hasReadonlyModifier(node: ts.Node): boolean {
	const modifiers = (node as ts.Node & { modifiers?: ts.NodeArray<ts.ModifierLike> }).modifiers;
	if (!modifiers) {
		return false;
	}
	return modifiers.some((mod: ts.ModifierLike) => mod.kind === ts.SyntaxKind.ReadonlyKeyword);
}

function extractLiteral(
	literal: ts.LiteralExpression | ts.PrefixUnaryExpression | ts.NullLiteral | ts.BooleanLiteral
): unknown {
	if (ts.isStringLiteral(literal) || ts.isNoSubstitutionTemplateLiteral(literal)) {
		return literal.text;
	}
	if (ts.isNumericLiteral(literal)) {
		return Number(literal.text);
	}
	if (ts.isPrefixUnaryExpression(literal) && ts.isNumericLiteral(literal.operand)) {
		return Number(`-${literal.operand.text}`);
	}
	if (literal.kind === ts.SyntaxKind.TrueKeyword) {
		return true;
	}
	if (literal.kind === ts.SyntaxKind.FalseKeyword) {
		return false;
	}
	if (literal.kind === ts.SyntaxKind.NullKeyword) {
		return null;
	}
	return literal.getText();
}

function formatLabel(value: string): string {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.replace(/[-_]/g, ' ')
		.replace(/^([a-z])/, (_, char) => char.toUpperCase());
}

function buildTemplatePattern(node: ts.TemplateLiteralTypeNode): string {
	let result = node.head.text;

	node.templateSpans.forEach(span => {
		result += '${' + describeTemplateType(span.type) + '}';
		result += span.literal.text;
	});

	return result;
}

function describeTemplateType(typeNode: ts.TypeNode): string {
	switch (typeNode.kind) {
		case ts.SyntaxKind.StringKeyword:
			return 'string';
		case ts.SyntaxKind.NumberKeyword:
			return 'number';
		case ts.SyntaxKind.BooleanKeyword:
			return 'boolean';
	}

	if (ts.isTypeReferenceNode(typeNode)) {
		return typeNode.typeName.getText();
	}

	return typeNode.getText();
}

function isLiteralTypeNode(node: ts.TypeNode): node is ts.LiteralTypeNode {
	return node.kind === ts.SyntaxKind.LiteralType;
}