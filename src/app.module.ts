import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { TodoModule } from './modules/todo/todo.module';


@Module({
  imports: [
    SharedModule,
    TodoModule
  ]
})
export class AppModule { }
