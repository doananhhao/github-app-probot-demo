const xml2js = require('xml2js');

export class XMLHelper {

    static async parse(xml: string): Promise<string> {
        return new xml2js.Parser().parseStringPromise(xml);
    }

    static async build(content: string): Promise<string> {
        return new xml2js.Builder().buildObject(content);
    }

}