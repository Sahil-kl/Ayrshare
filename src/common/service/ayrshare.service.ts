import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
const axios = require('axios')
const qs = require('qs')

@Injectable()
export class AyrshareService {
    API_KEY : string
    constructor( private config: ConfigService ){
        this.API_KEY = this.config.get('API_KEY')
    }
    async getPostById(id) {
      try {
        let config = {
          method: 'get',
          url: `https://app.ayrshare.com/api/post/${id}`,
          headers: { 
            'Authorization': `Bearer ${this.API_KEY}`, 
            'Content-Type': 'application/json'
          }
        };
        let post = await axios(config)

        if (post) {
          return post.data;
        }
        return post;
      }catch(err){
        console.log('ERR=====>',err.response.data)
        return err.response.data
      }
  }
    
  async upload(file) {
        try {
          let config = {
            method: 'post',
            url: 'https://app.ayrshare.com/api/media/upload',
            headers: { 
              'Authorization': `Bearer ${this.API_KEY}`, 
              'Content-Type': 'application/json'
            },
            data : {
              'file': file.buffer,
              'fileName': file.originalName
            }
          };
          
          let uploadFile = await axios(config)
          console.log('uploadFile====>',uploadFile)
          if (uploadFile) {
            return uploadFile.data;
          }
          return false;
      }catch(err){
        console.log('ERR=====>',err.response)
        return err.response.data
      }
    }
}
