import { Module, Global } from '@nestjs/common';
import { B2Service } from './b2.service';

@Global()
@Module({
  providers: [B2Service],
  exports: [B2Service],
})
export class FilesModule {}