# Chapter 6. ORM 사용해보기 - DB 마이그레이션 파일 관리해보기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 테이블 생성까지 ORM으로 할 수는 없을까?

기존에는 데이터베이스 테이블들을 수동으로 만들었을 거예요. `CREATE TABLE` 문을 일일이 입력하고, 수정이 필요하면 `ALTER TABLE`로 컬럼 수정도 직접 해야 했습니다.

하지만 이렇게 하다보면 데이터베이스 테이블들의 변경 사항이 반영이 되었는지 확인하기도 어렵고, 다른 개발자들과 협업할 때에도 문제가 발생할 수 있습니다.

Prisma를 사용하면 `prisma/schema.prisma` 파일에 테이블의 명세를 모두 적어두게 되는데, 이 파일을 기반으로 테이블을 생성, 수정까지 자동으로 할 수는 없을까요?

### 👉 Prisma Migrate 도구

Prisma에는 Migrate 도구가 존재하는데, 크게 2가지로 볼 수 있습니다.

- `npm exec prisma migrate dev`: 개발 과정에서 실행하는 도구입니다. Schema 파일을 수정하고 이 도구를 실행하면, 자동으로 데이터베이스에 변경 사항을 반영하고, Migration 파일을 생성해줍니다.
- `npm exec prisma migrate deploy`: 나중에 한 번에 운영 환경에 데이터베이스 변경 사항을 적용할 때 실행하는 도구입니다.

저희는 개발 과정이므로 `npm exec prisma migrate dev` 도구를 사용해보도록 하겠습니다.

<aside>
🚨

기존에 Prisma로 관리하지 않고 있던 데이터베이스를 Prisma Migrate로 관리하게 되면 기존 테이블들이 모두 삭제되고 재생성됩니다! 필요한 데이터는 직접 백업해주셔야 합니다!

</aside>

### 👉 `npm exec prisma migrate dev`

터미널에 `npm exec prisma migrate dev` 를 입력하면 아래와 같은 화면이 나올 것입니다. 기존에 데이터베이스를 사용하고 있지 않았기 때문에 모든 테이블과 데이터를 삭제하고 재생성하겠다는 내용인데요, 백업이 완료되셨다면 진행해주세요!

![CleanShot 2024-09-17 at 15.04.13@2x.png](Chapter%206%20ORM%20%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20DB%20%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98%20%ED%8C%8C%EC%9D%BC%20%EA%B4%80%EB%A6%AC%ED%95%B4%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-17_at_15.04.132x.png)

- `Do you want to continue? All data will be lost.`: `y` 를 입력합니다.
- `Enter a name for the new migration`: 저는 `init database` 라고 간단히 입력했습니다.

![CleanShot 2024-09-17 at 15.07.32@2x.png](Chapter%206%20ORM%20%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20DB%20%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98%20%ED%8C%8C%EC%9D%BC%20%EA%B4%80%EB%A6%AC%ED%95%B4%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-17_at_15.07.322x.png)

이렇게 `prisma/migrations/` 폴더 안에 migration을 관리하는 SQL 파일들을 자동으로 생성합니다. 동시에 데이터베이스에 변경 사항을 모두 자동으로 적용해줍니다.

![이런 파일들이 생겨있을 거예요!](Chapter%206%20ORM%20%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20DB%20%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98%20%ED%8C%8C%EC%9D%BC%20%EA%B4%80%EB%A6%AC%ED%95%B4%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-17_at_15.18.022x.png)

이런 파일들이 생겨있을 거예요!

- 만약 `Do you want to continue? All data will be lost.` 가 뜨지 않는 경우에는?
    
    ![image.png](Chapter%206%20ORM%20%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20DB%20%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98%20%ED%8C%8C%EC%9D%BC%20%EA%B4%80%EB%A6%AC%ED%95%B4%EB%B3%B4%EA%B8%B0/image.png)
    
    간혹가다 이런 메세지가 뜨고 Do you want to continue? 가 뜨지 않는 경우가 있습니다.
    
    그럴 때에는 수동으로 해주면 됩니다. (마찬가지로 필요한 데이터가 있다면 꼭 백업을 미리 해주세요.)
    
    ```bash
    npx prisma migrate reset
    ```
    
    이 명령을 실행하면 
    
    ![image.png](Chapter%206%20ORM%20%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20DB%20%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98%20%ED%8C%8C%EC%9D%BC%20%EA%B4%80%EB%A6%AC%ED%95%B4%EB%B3%B4%EA%B8%B0/image%201.png)
    
    이때 y를 눌러 진행해주면 됩니다. 
    
    💭 `npx prisma migrate reset`  실행 시 어떤 일이 일어날까요?
    
    Prisma는 reset 시 다음 과정을 거칩니다. 
    
    먼저 기존 DB를 Drop하고 새 DB를 생성합니다.
    
    그리고 `prisma/migrations`  폴더 안의 migration SQL 파일을 순서대로 실행해 줍니다. 
    
    만약 migration을 생성하지 않은 상태라면  파일이 없으니 아직 테이블들이 만들어지지는 않은 상태라는 걸 알 수 있습니다. 
    
    그럼 `npm exec prisma migrate dev`  명령을 다시 실행해주면 됩니다. 
    

### 👉 변경 사항 만들어보기

`prisma/schema.prisma` 파일에 적당한 변경 사항을 추가해보겠습니다. `String` 컬럼들에 `@db.VarChar(...)`과 같은 내용을 추가하거나 수정해도 좋고, 새로운 Model을 추가해 테이블을 생성해주셔도 좋습니다.

저는 테이블 몇 개를 추가하고, 다시 한 번 `npm exec prisma migrate dev`를 입력해보겠습니다.

```sql
-- CreateTable
CREATE TABLE `store` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_store_review` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `store_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `content` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_store_review` ADD CONSTRAINT `user_store_review_store_id_fkey` FOREIGN KEY (`store_id`) REFERENCES `store`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_store_review` ADD CONSTRAINT `user_store_review_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
```

![마이그레이션 파일이 하나 추가된 것을 볼 수 있습니다!](Chapter%206%20ORM%20%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20DB%20%EB%A7%88%EC%9D%B4%EA%B7%B8%EB%A0%88%EC%9D%B4%EC%85%98%20%ED%8C%8C%EC%9D%BC%20%EA%B4%80%EB%A6%AC%ED%95%B4%EB%B3%B4%EA%B8%B0/CleanShot_2024-09-17_at_15.18.292x.png)

마이그레이션 파일이 하나 추가된 것을 볼 수 있습니다!

데이터베이스를 직접 확인해보셔도 테이블들이 모두 잘 생성, 반영된 것을 볼 수 있습니다.

### 👉 결론

이렇게 ORM을 통해 DB 테이블들을 관리하면 아래와 같은 장점들이 있습니다.

- Migration 파일들이 Git을 통해 같이 관리돼서 나중에 테이블의 변경 사항을 한 눈에 보기 편합니다.
- Schema 파일만 작성해도 테이블이 자동으로 생성되고 반영되므로 개발하기 훨씬 편리합니다.

하지만 이렇게 ORM으로 관리하게 되면 의도하지 않은 내용이 데이터베이스 테이블에 반영되거나, 문제가 발생했을 때 확인하고 조치하기 어려울 수 있습니다. 또한, ORM을 통해 관리하는 방법도 알아야 하므로 알아야 하는 부분이 늘어나는 단점도 있습니다.

그리고 혼자서 ORM을 사용하는 것과 팀 프로젝트에서 함께 사용하는 것은 완전히 다른 이야기입니다. 

예를 들어, 내가 새로운 migration을 생성해서 Git에 푸시했는데, 

팀원이 그 변경사항을 가져오지 않은 채 또 다른 migration을 생성했다면 어떻게 될까요?

이 경우 migration 기록이 충돌하거나 꼬일 가능성이 높습니다.

심할 경우, 최후의 수단으로 **DB reset**을 해야 하는 일이 생길 수도 있습니다.

그런 일이 생기지 않으려면 팀 단위로 프로젝트를 하는 경우에는 보통 지켜야 할 규칙들을 정합니다.

보통 `schema.prisma`와 `migrations/*`를 코드처럼 리뷰·버전 관리하고, 운영 반영은 `migrate deploy`만 사용합니다. 개발 DB는 필요 시 `reset`해도 되지만, 운영 DB는 절대 `reset`하지 않습니다.

지금은 다소 복잡하고 낯설게 느껴질 수 있지만,  프로젝트를 직접 진행하다 보면 자연스럽게 감히 잡힐 것입니다.  

따라서 프로젝트에 마이그레이션까지 ORM으로 관리할지는 팀원들과 함께 이야기를 나눠 신중하게 결정해보셔도 좋을 것 같습니다.

자주 쓰이는 migration 명령어들을 한번 정리해 보겠습니다

- `npx prisma migrate dev`
    - 개발 단계에서 스키마를 변경할 때 사용합니다. 마이그레이션을 생성하고 적용해줍니다.
    - 새 migration이 생성되고, 로컬 DB에 바로 반영됩니다.
    - 데이터는 보존됩니다.
- `npx prisma migrate deploy`
    - 운영/테스트에 “이미 존재하는” 마이그레이션을 적용할 때 사용됩니다.
    - 새 파일을 만들지 않으며, 배포 파이프라인에서 사용합니다.
    - 데이터는 보존됩니다.
- `npx prisma db push`
    - 스키마를 “그대로” DB에 밀어 넣을 때 사용합니다. 마이그레이션 파일은 생성되지 않습니다.
    - 빠르게 실험할 때만 사용하고, 팀/운영에서는 보통 지양하는 명령어입니다.
    - 데이터는 보존됩니다.
- `npx prisma migrate reset`
    - 개발 DB를 초기화 할 때 사용합니다.
    - `migrations/*`를 순서대로 재적용하고 시드가 있다면 실행합니다.
    - 데이터는 모두 삭제됩니다.

### 👫 +) 팀 프로젝트 협업 팁

- `migrate dev` 는 반드시 Git에 커밋해서 다른 팀원들과 동기화를 시킵니다.
- 운영 환경에서는 `db push` , `reset` 사용을 지양합니다.
- 충돌 방지를 위해 PR에 `schema.prisma`와 `migrations/*`가 **세트로 들어가야** 합니다.

꼭 이것만이 정답은 아니며, 프로젝트 상황에 따라 팀원들과 충분히 논의하여, 우리 팀에 맞는 규칙을 만들어나가는 것이 가장 중요합니다.