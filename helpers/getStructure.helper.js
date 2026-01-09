import fs from 'fs';
import path from 'path';

function scanDirectory(dir, indent = '', outputLines = []) {
	const items = fs.readdirSync(dir);

	items.forEach((item) => {
		const fullPath = path.join(dir, item);
		const stats = fs.statSync(fullPath);

		if (
			fullPath.match(/node_modules/) ||
			fullPath.match(/\.git/) ||
			fullPath.match(/project_structure\.txt/)
		)
			return;

		if (stats.isDirectory()) {
			outputLines.push(`${indent}📁 ${item}/`);
			scanDirectory(fullPath, indent + '  ', outputLines);
		} else {
			const size = (stats.size / 1024).toFixed(2);
			outputLines.push(`${indent}📄 ${item} (${size} KB)`);
		}
	});

	return outputLines;
}

function createProjectStructureReport(
	rootDir = '.',
	outputFile = 'project_structure.txt'
) {
	try {
		const absolutePath = path.resolve(rootDir);

		if (!fs.existsSync(absolutePath)) {
			throw new Error('Указанная директория не существует');
		}

		console.log(`Сканирую: ${absolutePath}`);

		const outputLines = [];
		outputLines.push(`Структура проекта: ${absolutePath}`);
		outputLines.push(`Дата создания отчета: ${new Date().toLocaleString()}`);
		outputLines.push('='.repeat(50));

		scanDirectory(absolutePath, '', outputLines);

		const totalLines = outputLines.length - 3;
		outputLines.push('='.repeat(50));
		outputLines.push(`Всего элементов: ${totalLines}`);

		fs.writeFileSync(outputFile, outputLines.join('\n'), 'utf-8');
		console.log(`Отчет сохранен в: ${outputFile}`);
	} catch (error) {
		console.error('Ошибка:', error.message);
	}
}

// Использование:
createProjectStructureReport(); // Для текущей директории
// Или укажите конкретную папку:
// createProjectStructureReport('/путь/к/проекту');
