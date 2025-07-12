import { Request, Response } from 'express';
import generateQrHandler from '../src/handlers/generate-qr';

jest.mock('uuid', () => ({ v4: () => 'mock-uuid' }));
jest.mock('qrcode', () => ({
  toDataURL: jest.fn(() => Promise.resolve('mock-qr-url'))
}));

jest.mock('../src/utils/crypto', () => ({
  encrypt: jest.fn().mockReturnValue('mock-encrypted-data')
}));

jest.mock('../src/utils/env', () => jest.fn(() => 'http://localhost:3000'));
jest.mock('../src/routes', () => ({ visitorInfoRoute: 'visitor-info' }));

describe('generateQrHandler', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: jest.Mock;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;

  beforeEach(() => {
    jsonMock = jest.fn();
    statusMock = jest.fn().mockReturnThis();
    sendMock = jest.fn();
    req = { body: {
      visitorName: 'John',
      carPlate: 'ABC123',
      personToVisit: 'Jane',
      addressToVisit: '123 Main St'
    }};
    res = { json: jsonMock, status: statusMock, send: sendMock } as any;
  });

  it('should respond with uuid, qr, and visitUrl', async () => {
    const { encrypt } = require('../src/utils/crypto');
    await generateQrHandler(req as Request, res as Response);
    expect(encrypt).toHaveBeenCalledWith(JSON.stringify({
      uuid: 'mock-uuid',
      visitorName: 'John',
      carPlate: 'ABC123',
      personToVisit: 'Jane',
      addressToVisit: '123 Main St'
    }));
    expect(jsonMock).toHaveBeenCalledWith({
      uuid: 'mock-uuid',
      qr: 'mock-qr-url',
      visitUrl: expect.stringContaining('/visitor-info?data=mock-encrypted-data')
    });
  });

  it('should return 500 if QRCode.toDataURL throws', async () => {
    const QRCode = require('qrcode');
    QRCode.toDataURL.mockImplementationOnce(() => Promise.reject('fail'));
    await generateQrHandler(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(500);
    expect(sendMock).toHaveBeenCalledWith('Error generating QR');
  });

  it('should return 400 if required fields are missing', async () => {
    req.body = {};
    await generateQrHandler(req as Request, res as Response);
    expect(statusMock).toHaveBeenCalledWith(400);
    expect(sendMock).toHaveBeenCalledWith('Missing required fields');
  });
});
