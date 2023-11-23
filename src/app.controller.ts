import { Controller, Get ,Param,Post,Body,Patch,Query} from '@nestjs/common';
import { AppService } from './app.service';
import { userDto } from './dto/user.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  ////////////
  ////////////
  @Get()
  async widgetAmoCrm(@Query() queryParams:any){
    return await this.appService.WidgetAmoCrm(queryParams)
  }
  ////////////
  ////////////
  @Get('keys')
  async postAuthKey(){
    return await this.appService.postAuthKey()
  }
  @Get('refresh')
  async refresh(){
    return await this.appService.refreshAuthAcees()
  }
  @Get('customFileds')
  async getCustomFields(){
    return await this.appService.getCustomFiled()
  }
  @Get('redirect')
  async getRedirect(){
    return await "asd"
  }

}
