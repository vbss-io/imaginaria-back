import type { UserAuth } from '@/infra/facades/user-auth.dto'
import { UserAuthFacade } from '@/infra/facades/user-auth.facade'

export class RequestFacade {
  protected user: UserAuthFacade

  constructor() {
    this.user = new UserAuthFacade()
  }

  public setUser(user: UserAuth): void {
    this.user.setUser(user)
  }

  public getUser(): UserAuth {
    return this.user.getUser() as UserAuth
  }
}
