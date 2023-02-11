import type { z, zodLoginDto, UserDto, LoginResponseDto } from 'muuzika-zod';
import { ApiService } from './api.service';

export class AuthService {
	constructor(private readonly apiService: ApiService) {}

	async whoAmI(): Promise<UserDto> {
		return this.apiService.get<UserDto>('/auth/whoami').then((res) => res.json());
	}

	async login(payload: z.infer<typeof zodLoginDto>): Promise<LoginResponseDto> {
		return this.apiService
			.post<LoginResponseDto, z.infer<typeof zodLoginDto>>('/auth/login', payload)
			.then((res) => res.json());
	}

	static fromFetch(_fetch: typeof fetch) {
		return new AuthService(new ApiService(_fetch));
	}
}
