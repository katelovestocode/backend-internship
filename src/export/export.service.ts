import { Injectable } from '@nestjs/common'
import { RedisService } from 'src/redis/redis.service'

@Injectable()
export class ExportService {
  constructor(private readonly redisService: RedisService) {}

  async exportUserQuizResults(
    userId: number,
    quizId: number,
    companyId: number,
  ): Promise<any> {
    const key = `quiz_responses:${userId}:${quizId}:${companyId}`

    const data = await this.redisService.get(key)
    return data
  }

  findOne(id: number) {
    return `This action returns a #${id} export`
  }
}
