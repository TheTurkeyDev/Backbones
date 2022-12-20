export namespace main {
	
	export class CameraData {
	    id: string;
	    sourceType: number;
	    outputType: number;
	    name: string;
	    ip: string;
	    port: number;
	    destPort: number;
	    fileName: string;
	    running: boolean;
	
	    static createFrom(source: any = {}) {
	        return new CameraData(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.id = source["id"];
	        this.sourceType = source["sourceType"];
	        this.outputType = source["outputType"];
	        this.name = source["name"];
	        this.ip = source["ip"];
	        this.port = source["port"];
	        this.destPort = source["destPort"];
	        this.fileName = source["fileName"];
	        this.running = source["running"];
	    }
	}

}

