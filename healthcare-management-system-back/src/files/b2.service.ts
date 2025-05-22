import { Injectable, InternalServerErrorException } from '@nestjs/common';
const B2 = require('backblaze-b2');

@Injectable()
export class B2Service {
  private b2: any;
  private bucketId = process.env.B2_BUCKET_ID;

  constructor() {
    this.b2 = new B2({
      applicationKeyId: process.env.B2_APPLICATION_KEY_ID,
      applicationKey:   process.env.B2_APPLICATION_KEY,
    });
  }

  private async authorize() {
    try {
      await this.b2.authorize();
    } catch (err) {
      throw new InternalServerErrorException('Error authorizing with Backblaze B2');
    }
  }

  async uploadFile(buffer: Buffer, key: string): Promise<string> {
    await this.authorize();
    const uploadUrl = await this.b2.getUploadUrl({ bucketId: this.bucketId });
    const resp = await this.b2.uploadFile({
      uploadUrl:       uploadUrl.data.uploadUrl,
      uploadAuthToken: uploadUrl.data.authorizationToken,
      fileName:        key,
      data:            buffer,
    });
    // Devuelve URL pública por defecto
    return `https://f002.backblazeb2.com/file/${this.bucketId}/${encodeURIComponent(key)}`;
  }
}
