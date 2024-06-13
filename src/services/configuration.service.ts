import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from '../shared/types';

@Injectable({
    providedIn: 'root',
})
export class ConfigurationService {
    private configSubject: BehaviorSubject<AppConfig> = new BehaviorSubject<AppConfig>({} as unknown as AppConfig);
    public config$: Observable<AppConfig> = this.configSubject.asObservable();

    constructor(private readonly http: HttpClient) { }

    initConfig(): void {
        this.http.get("/config.json").subscribe((res) => {
            this.configSubject.next(res as AppConfig);
        });
    }

    setConfig(newConfig: Partial<AppConfig>): void {
        const currentConfig = this.configSubject.getValue();
        const updatedConfig = { ...currentConfig, ...newConfig };
        this.configSubject.next(updatedConfig);
    }

    getConfig(): AppConfig {
        return this.configSubject.getValue();
    }

    getConfigValue<T>(key: keyof AppConfig): T {
        return this.configSubject.getValue()[key];
    }

    setConfigValue<T>(key: keyof AppConfig, value: T): void {
        const currentConfig = this.configSubject.getValue();
        const updatedConfig = { ...currentConfig, [key]: value };
        this.configSubject.next(updatedConfig);
    }
}
