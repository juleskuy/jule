import fs from 'fs';
import path from 'path';

export class JsonDatabase<T = any> {
    private filePath: string;
    private data: T;

    constructor(fileName: string, defaultData: T) {
        const dbDir = path.join(process.cwd(), 'database');

        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        this.filePath = path.join(dbDir, fileName);
        this.data = defaultData;
        this.load();
    }

    private load(): void {
        try {
            if (fs.existsSync(this.filePath)) {
                const fileContent = fs.readFileSync(this.filePath, 'utf-8');
                this.data = JSON.parse(fileContent);
            } else {
                this.save();
            }
        } catch (error) {
            console.error(`Error loading database ${this.filePath}:`, error);
            this.data = this.data;
        }
    }

    private save(): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf-8');
        } catch (error) {
            console.error(`Error saving database ${this.filePath}:`, error);
        }
    }

    public get(): T {
        return this.data;
    }

    public set(data: T): void {
        this.data = data;
        this.save();
    }

    public update(updateFn: (data: T) => T): void {
        this.data = updateFn(this.data);
        this.save();
    }
}
