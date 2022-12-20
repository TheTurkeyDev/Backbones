import { OutputType } from './output-type';
import { SourceType } from './source-type';

export type CameraData = {
    readonly id: string
    readonly sourceType: SourceType
    readonly outputType: OutputType
    readonly name: string
    readonly ip: string
    readonly port: number
    readonly destPort: number
    readonly fileName: string
    readonly running: boolean
}
