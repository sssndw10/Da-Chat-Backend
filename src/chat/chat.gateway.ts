import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MessagesService } from 'src/messages/messages.service';

interface MessageType {
  body: string;
  userId: string;
  roomId: string;
}

@WebSocketGateway(3001, {
  cors: {
    origin: 'http://localhost:5173',
  },
})
export class ChatGateway {
  constructor(private readonly messagesService: MessagesService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  async handleEvent(@MessageBody() body: MessageType) {
    console.log('Event accepted: message, body:', body);
    const created = await this.messagesService.createMessage(
      body.userId,
      body.body,
      body.roomId,
    );

    const userPopulated = await this.messagesService.getMessageById(
      created._id,
    );

    console.log('Final document:', userPopulated);

    this.server.emit(`onMessage_${body.roomId}`, userPopulated);
  }
}
