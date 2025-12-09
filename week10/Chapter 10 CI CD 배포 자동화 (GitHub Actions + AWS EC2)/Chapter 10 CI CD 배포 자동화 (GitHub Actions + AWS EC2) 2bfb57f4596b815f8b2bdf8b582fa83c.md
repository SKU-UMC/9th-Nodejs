# Chapter 10. CI/CD 배포 자동화  (GitHub Actions + AWS EC2) - CI/CD 파이프라인 개선하기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 무엇을 개선할 수 있을까?

아무래도 이런 부분이 아직 불편하지 않나 싶어요. 이제 이 부분까지 한 번 같이 개선해보겠습니다.

- 데이터베이스 스키마를 자동으로 반영할 수 없을까?

### 🤔 데이터베이스 스키마를 자동으로 반영할 수 없을까?

우리의 데이터베이스 스키마는 이제 `prisma/schema.prisma` 파일을 통해 관리되고 있고, Prisma의 Migrate 커맨드를 통해서 자동화할 수도 있는 상태입니다.

저는 아래처럼 한 번 개선해보도록 하겠습니다.

```yaml
name: deploy-main

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      # Prisma 폴더가 변경되었는지 감지하는 단계 
      - name: Check prisma has changes
        uses: dorny/paths-filter@v3
        id: paths-filter
        with:
          filters: |
            prisma: ["prisma/**"]

      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "$EC2_SSH_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

         
          cat >>~/.ssh/config <<END
          Host umc9thworkbook
            HostName $EC2_HOST
            User $EC2_USER
            IdentityFile ~/.ssh/id_rsa
            StrictHostKeyChecking no
          END
        env:
          EC2_USER: ubuntu
          EC2_HOST: ${{ secrets.EC2_HOST }}
          EC2_SSH_KEY: ${{ secrets.EC2_SSH_KEY }}

      - name: Copy Workspace
        run: |
          ssh umc9thworkbook 'sudo mkdir -p /opt/app'
          ssh umc9thworkbook 'sudo chown ubuntu:ubuntu /opt/app'
          scp -r ./[!.]* umc9thworkbook:/opt/app

      - name: Install dependencies
        run: |
          ssh umc9thworkbook 'cd /opt/app; npm install'
          ssh umc9thworkbook 'cd /opt/app; npx prisma generate'

      - name: Apply prisma migrations
        if: steps.paths-filter.outputs.prisma == 'true'
        run: |
          ssh umc9thworkbook 'cd /opt/app; npx prisma migrate deploy'

      - name: Copy systemd service file
        run: |
          ssh umc9thworkbook '
            echo "[Unit]
            Description=UMC 9th Project
            After=network.target

            [Service]
            User=${USER}
            ExecStart=/usr/bin/npm run start --prefix /opt/app/
            Restart=always

            [Install]
            WantedBy=multi-user.target" | sudo tee /etc/systemd/system/app.service
          '

      - name: Enable systemd service
        run: |
          ssh umc9thworkbook 'sudo systemctl daemon-reload'
          ssh umc9thworkbook 'sudo systemctl enable app'

      - name: Restart systemd service
        run: |
          ssh umc9thworkbook 'sudo systemctl restart app'
```

파이프라인을 한 번에 올려두었는데, 아래에서 변경된 부분을 하나씩 확인해볼게요.

```yaml
- name: Check prisma has changes
  uses: dorny/paths-filter@v3
  id: paths-filter
  with:
    filters: |
      prisma: ["prisma/**"]
```

이 부분은 `prisma` 폴더의 파일이 하나라도 바뀌었는지 검사하는 부분입니다.

저희 저장소의 `prisma` 폴더 안에는 Schema 파일과 Migration 파일들이 존재하는데, 이 파일들이 새로 추가되거나 변경되었을 때 탐지하기 위한 코드입니다!

```yaml
- name: Install dependencies
        run: |
          ssh umc9thworkbook 'cd /opt/app; npm install'
          ssh umc9thworkbook 'cd /opt/app; npx prisma generate'

      - name: Apply prisma migrations
        if: steps.paths-filter.outputs.prisma == 'true'
        run: |
          ssh umc9thworkbook 'cd /opt/app; npx prisma migrate deploy'
```

이 부분은 `steps.paths-filter.outputs.prisma`를 통해 `prisma` 폴더의 파일이 하나라도 바뀌었다면, EC2 서버에 추가적으로 DB Migrate를 실행하는 부분입니다. (Prisma Client 코드는 항상 생성하도록 분리해두었습니다.)

```yaml
 - name: Copy systemd service file
        run: |
          ssh umc9thworkbook '
            echo "[Unit]
            Description=UMC 9th Project
            After=network.target

            [Service]
            User=${USER}
            ExecStart=/usr/bin/npm run start --prefix /opt/app/
            Restart=always

            [Install]
            WantedBy=multi-user.target" | sudo tee /etc/systemd/system/app.service
          '
```

그리고 이제 `prisma` 폴더의 파일이 변경될 때 별도의 코드들을 실행되도록 개선했기 때문에, `npm run dev` 대신 `npm run start`로 단순히 서버가 실행만 되도록 변경했습니다.