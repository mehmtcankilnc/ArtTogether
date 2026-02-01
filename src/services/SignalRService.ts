import { API_BASE_URL } from '@env';
import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr';
import { Storage } from '../utils/storage';

export interface StrokeDto {
  color: string;
  width: number;
  pathData: string;
}

class SignalRService {
  private connection: HubConnection | null = null;
  private static instance: SignalRService;

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  public async connect(url: string) {
    if (this.connection) return;

    this.connection = new HubConnectionBuilder()
      .withUrl(url, {
        accessTokenFactory: () => {
          const token = Storage.getAccessToken();
          return token ? token : '';
        },
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    try {
      await this.connection.start();
    } catch (err) {
      console.error('SignalR Connection Failed: ', err);
    }
  }

  public async joinRoom(roomId: string) {
    if (this.connection) {
      await this.connection.invoke('JoinRoom', roomId);
    }
  }

  public async sendStroke(projectId: string, stroke: StrokeDto) {
    if (this.connection) {
      try {
        await this.connection.invoke('SendStroke', projectId, stroke);
      } catch (err) {
        console.error('SendStroke Error: ', err);
      }
    }
  }

  public onReceiveStroke(
    callback: (userId: string, stroke: StrokeDto) => void,
  ) {
    if (this.connection) {
      this.connection.off('ReceiveStroke');

      this.connection.on('ReceiveStroke', (userId, stroke) => {
        callback(userId, stroke);
      });
    }
  }

  public async disconnect() {
    if (this.connection) {
      await this.connection.stop();
      this.connection = null;
    }
  }

  public async getHistory(projectId: string): Promise<StrokeDto[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/strokes/${projectId}`);
      if (!response.ok) throw new Error('Geçmiş yüklenemedi');

      return await response.json();
    } catch (error) {
      console.error('History Error:', error);
      return [];
    }
  }
}

export default SignalRService.getInstance();
