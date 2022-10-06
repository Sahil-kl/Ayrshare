import { Controller, Get, Post, Body, Param, Delete, Req, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { ApiBody, ApiConsumes, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AyrshareService } from 'src/common/service/ayrshare.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { PostAnalyticsDto, SocialAnalyticsDto } from 'src/common/dto/analytics.dto';


@Controller('users')
export class UsersController {
  API_KEY: string
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
    private readonly ayshareService: AyrshareService,
    ) {
    this.API_KEY = this.config.get('API_KEY')
  }
  @ApiTags('User-profiles')
  @Post()
  async create(@Req() req, @Res() res,@Body() body: CreateUserDto) {
    try{
      let userData = await this.usersService.create(body.title);
      if (userData.status == 'error'){
        return res.status(400).json({
          status: 400,
          error: userData
          })
      }
      let jwtUrl = await this.usersService.generateJWT( userData.profileKey)
      if (jwtUrl.status == 'error'){
        return res.status(400).json({
          status: 400,
          error: userData
          })
      }
      console.log(jwtUrl)
      userData.url= jwtUrl.url
      userData.token = jwtUrl.token
        res.status(200).json({
        status: 200,
        data: userData
        })

    }catch (err){
      console.log(err)
      res.status(500).json({
        status: 500,
        message: 'Something went wrong'
      })
    }

  }

  @ApiTags('User-profiles')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiTags('User-profiles')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @ApiTags('User-profiles')
  @Post('genrateJwt/:profileKey')
  @ApiParam({name: 'profileKey', required: true, type:'string'})
  async genearteJwt(@Param() param, @Req() req, @Res() res ) {
    try {
      const {profileKey} = param
      let jwtUrl = await this.usersService.generateJWT(profileKey)
      if (jwtUrl.status == 'error'){
        return res.status(400).json({
          status: 400,
          error: jwtUrl
          })
      }
      console.log(jwtUrl)
        res.status(200).json({
        status: 200,
        data: jwtUrl
        })
    }catch (err){
      console.log(err)
      res.status(500).json({
        status: 500,
        message: 'Something went wrong'
      })
    }
  }

  @ApiTags('User-profiles')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @ApiTags('Media')
  @Post('/upload-file')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() file, @Res() res, @Req() req) {
    try {
      console.log('file', file);

      const resp = await this.ayshareService.upload(file);
      console.log(resp)
      if (!resp) {
        return res.status(400).json({
          status: 400,
          message: 'Failed to upload file'
        })
      }

      res.status(200).json({
        status: 200,
        data: resp
      })

    } catch (err){
      console.log(err)
      res.status(500).json({
        status: 500,
        message: 'Something went wrong'
      })
    }
  }

  @ApiTags('Analytics')
  @Post('analytics-post')
  async postAnalytics(@Body() body: PostAnalyticsDto, @Req() req, @Res() res ) {
    try {
      let data = await this.usersService.postAnalytics(body)
      if (data && data.status == 'error'){
        return res.status(400).json({
          status: 400,
          error: data
          })
      }
      console.log(data)
        res.status(200).json({
        status: 200,
        data: data
        })
    }catch (err){
      console.log(err)
      res.status(500).json({
        status: 500,
        message: 'Something went wrong'
      })
    }
  }

  @ApiTags('Analytics')
  @Post('analytics-social/:profileKey')
  @ApiParam({name: 'profileKey', required: true, type:'string'})
  async socialAnalytics(@Body() body: SocialAnalyticsDto,@Param() param, @Req() req, @Res() res ) {
    const {profileKey}= param
    try {
      let data = await this.usersService.socialAnalytics(body, profileKey)
      if (data && data.status == 'error'){
        return res.status(400).json({
          status: 400,
          error: data
          })
      }
      console.log(data)
        res.status(200).json({
        status: 200,
        data: data
        })
    }catch (err){
      console.log(err)
      res.status(500).json({
        status: 500,
        message: 'Something went wrong'
      })
    }
  }

  

}
