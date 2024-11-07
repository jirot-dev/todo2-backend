import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { TodoModule } from './modules/todo/todo.module';
//import { OtelModule } from './shared/open-telemetry/open-telemetry.module';


@Module({
  imports: [
    SharedModule,
    //OtelModule.forRoot(),
    TodoModule
  ]
})
export class AppModule {}
