import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/')
  root() {
    return {
      status: 'ok',
      service: 'genzid-api',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    };
  }

  @Get('/health')
  health() {
    return { status: 'ok' };
  }

  @Get('/ready')
  ready() {
    return { status: 'ready' };
  }
}
