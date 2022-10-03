import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ConfigService } from '@nestjs/config';
import { ApiParam, ApiTags } from '@nestjs/swagger';
const request = require('request')

@ApiTags('User-profiles')
@Controller('users')
export class UsersController {
  API_KEY: string
  constructor(
    private readonly usersService: UsersService,
    private readonly config: ConfigService,
    ) {
    this.API_KEY = this.config.get('API_KEY')

  }

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

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
