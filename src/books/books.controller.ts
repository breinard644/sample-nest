import { Controller, HttpCode, Post, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('books')
@ApiTags()
@UseInterceptors(CacheInterceptor)
export class BooksController {
    constructor(private bookservice:BooksService){}

    @Post('list')
    @HttpCode(200)
    listBooks(){
        return this.bookservice.listAllBooks();
    }

}
