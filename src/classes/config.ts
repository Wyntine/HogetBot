import {
  existsSync,
  mkdirSync,
  readFileSync,
  watchFile,
  writeFileSync,
} from "fs";
import { dirname } from "path";
import { parse, stringify } from "yaml";

export class Config<Data> {
  private data: Data;
  private path: string;

  constructor(path: string) {
    this.path = path;
    this.createIfNotExists();
    this.data = this.reload(true);

    watchFile(this.path, () => {
      this.reload();
    });
  }

  public get<Key extends keyof Data>(key: Key): Data[Key] | undefined;
  public get(): Data;
  public get(key?: keyof Data): Data | Data[keyof Data] | undefined {
    if (key) return this.data[key];
    return this.data;
  }

  public set(data: Data): void {
    this.data = data;
    this.flush();
  }

  public setKey<Key extends keyof Required<Data>>(
    key: Key,
    data: Data[Key],
  ): void {
    this.data[key] = { ...data };
    this.flush();
  }

  public deleteKey(key: keyof Required<Data>): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { [key]: _, ...data } = this.data;
    this.set(data as Data);
  }

  public overwrite(data: Partial<Data>): void {
    this.set({ ...this.data, ...data });
  }

  public overwriteKey<Key extends keyof Required<Data>>(
    key: Key,
    data: Partial<Data[Key]>,
  ): void {
    this.setKey(key, { ...this.data[key], ...data });
  }

  private reload(firstLoad = false): Data {
    const data = parse(readFileSync(this.path, "utf-8")) as Data;
    if (!firstLoad) this.data = data;
    return data;
  }

  private flush(data?: Data): void {
    const dirPath = dirname(this.path);

    if (dirPath !== ".") {
      mkdirSync(dirPath, { recursive: true });
    }

    writeFileSync(this.path, stringify(data ?? this.data));
  }

  private createIfNotExists(): void {
    if (!existsSync(this.path)) {
      this.flush({} as Data);
    }
  }
}
