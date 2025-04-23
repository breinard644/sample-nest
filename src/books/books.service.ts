import { Injectable } from '@nestjs/common';

@Injectable()
export class BooksService {

    async listAllBooks(){
        return {msg: "all Books Displayed Here"}
    }
}
