import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthAbstractSvc } from './auth.abstract';
import { JwtService } from '@nestjs/jwt';

@Module({
	imports: [],
	controllers: [AuthController],
	providers: [
		{
			provide: AuthAbstractSvc,
			useClass: AuthService
		},
		JwtService
	]
})
export class AuthModule {}
