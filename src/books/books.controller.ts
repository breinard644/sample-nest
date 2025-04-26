import { Controller, HttpCode, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BooksService } from './books.service';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiBearerAuth('access-token')
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
