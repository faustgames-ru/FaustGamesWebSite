module system {
    export class environment {
        static getTickCount(): number {
            var d = new Date();
            return d.getTime();
        }
    }
} 