import { Body, Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { PostDto } from 'src/common/dto/post.dto';
import { AppService } from './app.service';
import { AyrshareService } from './common/service/ayrshare.service';
const SocialPost = require("social-post-api"); 
var request = require('request');




@Controller()
export class AppController {
  ENV: string
  social: any
  constructor(
    private readonly appService: AppService,
    private config: ConfigService,
    private ayrshareService: AyrshareService,
    
) {
   this.social = new SocialPost(this.config.get('API_KEY'));
  }

  // @Get()
  // async getHello() {
  //   return this.appService.getHello()
  // }

  @ApiTags('POST- Social Networks')
  @Post('/post')
  async post(@Req() req, @Res() res, @Body() body:PostDto){
    try {
      const post = await this.social.post(body).catch(console.error);   
          if (post){
            res.status(200).json({
              status: 200,
              message: 'Success',
              data: post
            })
            return
          }
          res.status(400).json({
            status: 400,
            message: 'Internal server error'
          })
          
    }catch(err){
      console.log(err)
      res.status(500).json({
        status: 500,
        error: err
      })
    }
  }


  @ApiTags('POST- Social Networks')
  @ApiParam({name: 'id', required : true, type: 'string'})
  @Get('/post/:id')
  async getPostData(@Req() req, @Res() res, @Param() param){
    try {
      const {id} = param
      let data = await this.ayrshareService.getPostById(id)
      if (data){
        res.status(200).json({
          status: 200,
          message: 'Record Found',
          data: data
          })
          return
      }

      res.status(400).json({
        status: 400,
        message: 'No record found'
      })
      
  // var options = {
  //   'method': 'GET',
  //   'url': `https://app.ayrshare.com/api/post/${id}`,
  //   'headers': {
  //     'Authorization':  `Bearer ${this.config.get('API_KEY')}`,
  //     'Content-Type': 'application/json'
  //   }
  // };
  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
    
  //   res.status(200).json({
  //     status: 200,
  //     data: response.body
  //   })
  // });
    }catch (e) {
      console.log(e.message);
      res.status(500).json({
        status: 500,
        message: 'Something went wrong here. Please try again later or contact support@fabulate.com.au',
        err: e.response.data,
      });
    }
  }
  
}
