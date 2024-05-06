import  HttpStatus  from 'http-status-codes'
import { IBookService } from 'application/port/book.service.interface'
import { Identifier } from 'di/identifiers'
import { Query } from 'infrastructure/repository/query/query'
import { inject } from 'inversify'
import { Request, Response } from 'express'
import { controller, httpDelete, httpGet, httpPatch, httpPost, request, response } from 'inversify-express-utils'
import { ILogger } from 'utils/custom.logger'
import { Book } from 'application/domain/model/book'
import { ApiExceptionManager } from 'ui/exception/api.exception.manager'
import { ApiException } from 'ui/exception/api.exception'


@controller('users/:user_id/books')
export class BookController {

    constructor(
        @inject(Identifier.BOOK_SERVICE) private readonly _bookService: IBookService,
        @inject(Identifier.LOGGER) readonly _logger: ILogger
    ) {
    }

    @httpPost('/')
    public async addBook(@request() req: Request, @response() res: Response) {
        try {
            const newBook: Book = new Book().fromJSON(req.body)
            const result: Book | undefined = await this._bookService.add(newBook)
            return res.status(HttpStatus.CREATED).send(this.toJSONView(result))
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/')
    public async getAllBooks(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result = await this._bookService.getAll(new Query().fromJSON(req.query))
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpGet('/:book_id')
    public async getBookById(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: Book | undefined = await this._bookService.getById(req.params.book_id,
                new Query().fromJSON(req.query))
            if (!result)return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFoundBook())
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpPatch('/:book_id')
    public async updateBook(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const book: Book = new Book().fromJSON(req.body)
            book.id = req.params.book_id
            const result = await this._bookService.update(book)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFoundBook())
            return res.status(HttpStatus.OK).send(result)
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    @httpDelete('/:book_id')
    public async removeBook(@request() req: Request, @response() res: Response): Promise<Response> {
        try {
            const result: boolean = await this._bookService.remove(req.params.book_id)
            if (!result) return res.status(HttpStatus.NOT_FOUND).send(this.getMessageNotFoundBook())
            return res.status(HttpStatus.NO_CONTENT).send()
        } catch (err: any) {
            const handlerError = ApiExceptionManager.build(err)
            return res.status(handlerError.code)
                .send(handlerError.toJSON())
        }
    }

    private toJSONView(
        entity: Book | Array<Book> | undefined
    ): object {
        if (entity instanceof Array) return entity.map(item => this.toJSONView(item))
        return entity?.toJSON()
    }

    private getMessageNotFoundBook(): object {
        return new ApiException(
            HttpStatus.NOT_FOUND,
            'Book not found!',
            'Book not found or already removed. A new operation for the same resource is not required!'
        ).toJSON()
    }


}
