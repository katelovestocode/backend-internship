import { CACHE_MANAGER } from '@nestjs/cache-manager'
import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import { CachedDataType } from './interface/interface'

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async set(key: string, value: any, ttl: number): Promise<void> {
    try {
      return await this.cache.set(key, value, ttl)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }

  async get(key: string): Promise<CachedDataType | null> {
    try {
      return await this.cache.get(key)
    } catch (error) {
      throw new InternalServerErrorException(error.message)
    }
  }
}
