# Chapter 10. CI/CD 배포 자동화 (GitHub Actions + AWS EC2) - CI/CD 파이프라인 구축하기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

## ✨ 배포를 해야 하는 이유

---

**우선, 기본적으로 한국의 네트워크는 사설 아이피의 비중이 매우 큽니다.**

즉, 여러분들이 API를 열심히 구현을 했다 하더라도 결국 여러분들의 노트북은 사설 IP 주소를 가진 상태로 와이파이에 연결이 되어 있기 때문에 외부에서 접근하기가 어렵습니다. 이를 극복하기 위해 **포트 포워딩**을 적용해도 여러분들의 PC를 종료하거나 PC에 연결된 와이파이가 달라지면 접근이 안되죠.

즉, 관리가 너무 힘들어지고 또 번거로운 상황이 계속해서 발생합니다.

그리고 여러분들이 직접 PC를 이용해서 외부에서 접속이 가능하도록 조치를 취했다고 하더라도 아래의 문제가 생기게 됩니다.

**실제로 서비스를 하게 된다면, 결국 트래픽이 얼마나 생길 지 모른다.**

1. 트래픽이 많이 몰린다면 Computer의 RAM, CPU 등 하드웨어의 성능이 좋아야 함
2. 트래픽이 얼마나 몰릴지 예상하는 것은 불가능하며 이에 따라 딜레마가 생긴다.

그리고 추가적으로 고려를 해야 할 부분이 있습니다. **데이터베이스를 관리하는 DBMS는 어떻게 관리를 할 것인가?**

우선 위의 내용은 뒤에서 다룰 예정이니, 우선 서버를 어떻게 배포할 지 고민해봅시다.

컴퓨터를 직접 서버로써 만드는 방식을 **온프레미스 방식**이라고 부릅니다.

반면 AWS처럼 컴퓨터를 빌리는 방식을 **클라우드 컴퓨팅**이라고 합니다.

## 📨 간단한 배포

---

AWS 부록에서 생성한 AWS VPC를 이용해서 EC2를 생성하고, 배포를 하고자 하는 코드를 가져와 EC2에서 실행하면 됩니다.

![직접 draw.io로 그린 그림 (✪‿✪)](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/Untitled.png)

직접 draw.io로 그린 그림 (✪‿✪)

그러면 위 그림처럼 표현이 가능한데요, 만약 서버 코드가 변경이 될 경우 직접 EC2에 배포가 된 코드를 수정해야 합니다.

부록에서 다룬 RDS까지 설정되어 있다면, 아래처럼 볼 수 있습니다.

![Untitled](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/Untitled%201.png)

그림 상으로는 감이 오지 않을 수도 있지만, **RDS도 하나의 컴퓨터**입니다. 그래서 Database를 위한 서버는 다른 컴퓨터에 분리가 된 상태인 것으로 볼 수 있습니다.

저렇게 하지 않고 이론 상 EC2도 하나의 컴퓨터이므로 아래 그림 처럼도 가능합니다. 물론 😇 **MySQL에서 외부에서 접속 가능하도록 직접 설정을 해줘야 합니다.** 😢

![Untitled](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/Untitled%202.png)

만약 위와 같이 했는데 아래처럼 된 경우에는… 어떻게 될까요?

![( ༎ຶŎ༎ຶ )](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/Untitled%203.png)

( ༎ຶŎ༎ຶ )

그림 상에 다 표현이 되었지만 MySQL이 RAM을 다 잡아먹어서 죽으면, 같은 Computer에 있는 서버도 같이 죽는 상황이 생기게 됩니다. 따라서 MySQL을 별도의 Computer로 분리해두는 것이 좋습니다

**정리를 해 봅시다.**

**서버를 직접 배포하게 되면 서버에 수정이 생기게 되었을 때 직접 다시 배포를 해야 해서 불편합니다. 따라서 자동적인 배포가 되는 파이프라인을 만들면 좋지 않을까요?**

🤨 **아니 서버 하나 수동 배포가 뭐가 힘들다고 호들갑 떠세요?** 🤨

물론 예시 상황은 서버가 하나여서 큰 부담은 없지만 아래와 같은 상황이 있다고 가정을 해봅시다.

![Untitled](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/Untitled%204.png)

동일한 서버라도 여러 컴퓨터에 배포가 필요하게 된다면 문제가 생깁니다. 서버가 10대의 컴퓨터, 100대의 컴퓨터에 배포되어야 한다면..? 점점 수동 배포는 힘들어지게 됩니다.

따라서 자동 배포가 되는 파이프라인을 만들 필요가 있습니다.

## ♾️ CI/CD

---

### CI (**Continuous Integration)** : 지속적 통합

= 코드가 수정이 될 때마다 지속적으로 편하게 통합이 되어 빌드, 테스트를 하는 과정입니다. UMC에서는 테스트 까지는 다루지 않고 지속적으로 **빌드**가 되는 과정까지 다룹니다.

CI 도구로는 GitHub Actions, AWS Code Pipeline, Jenkins, Argo Workflows 등이 존재합니다.

![Untitled](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/Untitled%205.png)

![Untitled](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/Untitled%206.png)

UMC는 GitHub Actions를 사용 할 예정입니다! GitHub Actions는 오픈소스는 무료로 제공되며, 비공개 저장소는 월 1,000 시간까지만 무료입니다. GitHub는 처음에는 무료이지만, 유료로 전환이 되면 AWS Code Pipeline보다 더 비싸집니다.

### CD (**Continuous Deploy/Delivery) :** 지속적 배포

**지속적 배포(CD)**는 쉽게말해, 코드가 변경될 때마다 자동으로 서버에 배포되는 것을 의미합니다. 이를 통해 사용자는 코드 배포 과정을 빠르고 자동화된 방식으로 처리할 수 있습니다.

AWS에서 CD에 사용되는 주요 도구로는 다음과 같은 것들이 있습니다:

1. **AWS Elastic Beanstalk (EB)**
    - **장점**:
        - 서버 설정, 로드밸런싱, 스케일링 등을 자동으로 관리해주기 때문에 **간편하게 배포**할 수 있습니다.
    - **단점**:
        - 자동화된 설정으로 인해 서버의 세부적인 부분을 **직접 제어할 수 없고** 유연성이 떨어집니다.
2. **Amazon ECS (Elastic Container Service)**
    - **장점**:
        - **컨테이너 기반**으로 애플리케이션을 관리하고 배포할 수 있습니다. Kubernetes보다 설정이 간단하지만, 충분한 유연성과 성능을 제공합니다.
    - **단점**:
        - **컨테이너 개념**을 이해하고 있어야 하고, 설정이 다소 복잡한 편입니다.
        - Kubernetes(EKS)에 비하면 설정 가능한 범위가 적고 제한되어 있습니다.
3. **Amazon EKS (Elastic Kubernetes Service)**
    - **장점**:
        - Kubernetes를 이용한 대규모 애플리케이션 배포에 유리하고, **자동화된 컨테이너 관리**와 **높은 확장성**을 제공합니다.
    - **단점**:
        - **Kubernetes 자체가 복잡**하기 때문에, 초기 설정과 운영에 많은 학습이 필요합니다.
        - 또한, 트래픽이 적고 작은 프로젝트에서는 **비용이 많이 들고 불필요하게 복잡**할 수 있습니다.

![image.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/image.png)

![image.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/image%201.png)

![image.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/image%202.png)

이렇게 다양한 배포 도구들이 존재하지만, 이번 UMC에서는 **EC2에 직접 배포하는 방식**을 선택했습니다.

그 이유는…

**EB**는 비교적 쉽고 설정을 대신 해주는 부분이 많아서 간편하지만, 직관적으로 배포 과정을 이해하기엔 다소 힘들다고 판단했습니다.

**ECS와 EKS**는 **컨테이너 기술에 대한 지식이 필요**하고, 비용 면에서 **효율적이지 않다**고 판단했습니다.

**특히, Kubernetes는 비용이 비싸서 충분한 규모의 서비스를 운영하는 경우가 아니라면 비효율적일 수 있습니다.**

따라서 **배포 과정을 직관적으로 이해**하고, **복잡한 설정 없이** 애플리케이션을 서버에 배포하는 경험을 위해 **EC2 직접 배포 방식을 선택**했습니다.

## 🪈 CI/CD 파이프라인 구축하기

---

우선 CI/CD 파이프라인을 잡기 전에 브랜치 전략부터 정해야 합니다. 보통 GitHub Flow를 따를 경우 아래와 같은 브랜치 흐름을 따르게 됩니다.

![[https://www.alexhyett.com/git-flow-github-flow/](https://www.alexhyett.com/git-flow-github-flow/)](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/97015.png)

[https://www.alexhyett.com/git-flow-github-flow/](https://www.alexhyett.com/git-flow-github-flow/)

- 개발 중인 브랜치는 `main`(`master`) 브랜치이고, 여기에 있는 코드를 배포하게 됩니다.
- 기능 구현 및 버그 수정은 `main` 브랜치에서 `feature/` 브랜치를 생성하여 진행합니다.

위의 방식을 꼭 따를 필요는 없지만, **기능들을 각 브랜치로 분리하여 동시에 여러 사람이 개발하고, 이를 하나의 브랜치에 합친 후 통합적으로 버그를 찾아내고 수정하는 과정**은 채택하는 것이 좋습니다.

그리고 서비스는 Server와 Client가 함께 잘 동작해야 하기 때문에, `main` 브랜치에 모여있는 코드를 외부에서도 접근이 가능하도록 배포하여 Client에서 API를 호출하고 잘 동작이 되는지 확인하는 과정이 필요합니다.

따라서 우선적으로 도출이 가능한 것은

**☑️ `main`에 담긴 코드는 항상 배포가 되어야 한다는 것**

**☑️ `main`에 담긴 코드 중 테스트가 완료된 커밋까지는 추가로 별도로 배포가 되어야 한다는 것**

그리고 이러한 배포 과정을 자동화하기 위해

☑️ **적어도 2개의 CI/CD 파이프라인이 있어야 한다는 것**도 알 수 있습니다. (항상 자동으로 배포하는 파이프라인과, 테스트가 완료되어 안정화된 배포 파이프라인)

주의해야 하는 것은 **팀원이 새로 브랜치를 팔 때, 반드시 `main` 브랜치에서 뻗어 나가도록 해야 한다는 것입니다.**

❗**자기가 기능을 구현하던 `feature/12`에서 새 기능을 위해 `feature/13`을 새로 만드는 행동은…
하면 안됩니다…. ｡ﾟ(*´□`)ﾟ｡**❗

반드시 `main` 브랜치에서 새 브랜치를 만들어야 하며 아래와 같은 두 상황을 가정해봅시다.

<aside>
1️⃣ **기능 구현을 마무리 했고 다음 기능을 구현해야 함**

1. 우선 깃허브에서 이슈를 생성 ← 이는 5주차에서 다뤘죠?
    1. 해당 이슈 번호가 13번이라면 - `feature/13`와 같이 브랜치 이름을 정하고,
    `main` 브랜치에서 브랜치를 새로 만들어야 합니다.
        
        ✔️ 우선 현재 브랜치가 어디인지 ***git branch***를 통해 확인,
        
        ✔️ `main` 브랜치가 아니라면 ***git checkout main***을 한 후
        
        👉 ***git pull origin main*과 같이 원격 저장소의 `main` 브랜치의 변경 사항을
        가져옵니다.**
        

이 과정은 잊지 말고 해야 하며 습관적으로 해야 합니다! 이후 ***git checkout -b feature/13***등 과 같이 새 브랜치를 만들고 작업을 하는 것입니다.

</aside>

<aside>
2️⃣ **기능 구현을 하던 중 갑자기 FE 팀원이나 BE 팀원이 기존 기능 수정 요구**

이는 1번과 다른 점이 한 가지 있습니다. 바로 ***git status***를 하면 아직 add가 되지 않은 변경 사항이 보인다는 것이죠.

이런 상황에서 1번처럼 `main`으로 이동 후 새 브랜치를 파면, **add가 되지 않은 변경사항이 따라오게 되어, 서로 다른 브랜치에 같은 변경된 코드가 존재하게 되어 추후 머지를 할 때 💥충돌💥이 발생합니다.**

이런 상황을 해결하려면, 우선 `main` 브랜치로 이동을 하기 전에 아래의 명령어를 입력해야 합니다.

***git stash -u***

위의 명령어는 현재 변경 사항을 따로 저장하는 명령어로 

***git stash pop***을 통해 스택처럼 마지막에 저장한 변경 사항을 다시 불러옵니다.

-u 옵션은 새로 만들어진 파일도 저장의 대상이 되게 하는 옵션입니다.

위처럼 변경 사항을 따로 저장 후 `main` 브랜치로 이동 후 수정 사항을 적용하는 `feature/` 브랜치를 만들어 해당 브랜치에서 작업을 수행하고, 다시 원래 작업하던 브랜치로 돌아와 ***git stash pop***으로 변경 사항을 다시 가져와 이어서 작업하는 것입니다.

</aside>

### 0. CI/CD 파이프라인 구축 준비

우선 워크북을 위한 예제에서는 `main` **브랜치에 새로 머지가 되면** CI/CD 파이프라인이 돌아 개발용 인프라에 존재하는 EC2에 서버가 배포가 되도록 하는 것을 해보겠습니다.

그러면 우선 `main` 브랜치가 있어야겠죠?

<aside>
⚙ **원래대로 라면…**

**처음 프로젝트를 위한 저장소 생성**

**→ `main` 브랜치에 초기 README나 아무것도 없는 Node.js 프로젝트 업로드**

**→ 이후 `main`에서 `feature` 브랜치 생성**

**→ 개발용 CI/CD 파이프라인 구축하기** 

**이렇게 설정하고,**

**각자 팀원끼리 `main`에서 `feature` 브랜치를 만들어서 기능 구현 후 `main`에 합치고, 최종 배포는 `main` 브랜치에서 테스트가 완료된 특정 커밋을 선택해 배포하게 됩니다.**

</aside>

그래서 배포하고 싶은 저장소에서 먼저 `main` 브랜치가 있는지 확인하고, 없다면 `main` 브랜치를 생성하여 진행해주세요.

![CleanShot 2024-09-16 at 23.24.32@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-16_at_23.24.322x.png)

이제 `main` **브랜치로 머지가 된 경우, GitHub Action을** 통해 **AWS EC2에 자동으로 배포가 되도록** CI/CD 파이프라인을 구축해봅시다.

우선 CI/CD 파이프라인 구축에 대한 이슈를 만들어서 진행합시다.

![CleanShot 2024-09-16 at 23.25.15@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-16_at_23.25.152x.png)

![CleanShot 2024-09-16 at 23.25.49@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-16_at_23.25.492x.png)

생성한 이슈에 대해서 브랜치를 만들게 되면, 팝업으로 뜨는 git 명령어를 통해 로컬 환경에서 사용할 수 있습니다. 위의 명령어를 복사하여 로컬 터미널에 입력하면, 로컬 환경에서 해당 브랜치로 이동된 것을 확인할 수 있습니다.

만약 위의 명령어를 복사를 못했더라도, 그냥 *git fetch origin*을 입력한 후 *git checkout*으로 브랜치를 이동시키면 됩니다.

이제 본격적으로 파이프라인을 만들어 봅시다!

### 1. GitHub Actions 파이프라인 작성하기

GitHub Actions는 GitHub가 해당 저장소에서 `.github` 폴더를 찾아, 그 내부의 YAML 파일들을 읽어들여 인식하고 실행됩니다. 유의할 점은, `.github` 폴더가 저장소의 가장 최상위 경로에 있어야 한다는 점입니다.

![CleanShot 2024-09-17 at 02.07.36@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_02.07.362x.png)

이렇게 그냥 여러분이 GitHub 웹에서 저장소에 접속 했을 때 보이는 저 파일 디렉토리 구조에서 `.github` 폴더가 보여야 한다는 것입니다. 만약 `.github`가 저장소의 최상위 경로가 아닌 다른 곳에 존재한다면, GitHub Action은 실행되지 않습니다.

따라서 여러분들의 프로젝트 최상단에서 `.github` 폴더를 추가하고, 그 안에 `workflows` 폴더도 만들어주세요. 그리고 그 안에 `deploy-main.yml` 파일을 만들도록 하겠습니다. (파일 이름은 자유롭게 선택해주셔도 괜찮습니다.)

![CleanShot 2024-09-17 at 02.08.58@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_02.08.582x.png)

우선 `main`에 PR이 머지된 경우 액션이 동작하도록 스크립트를 적어보겠습니다.

```yaml
name: deploy-main  # 파이프라인 이름은 자유롭게 지어주세요

on:
  push:
    branches:
      - main  # main 브랜치에 새로운 커밋이 올라왔을 떄 실행되도록 합니다
  workflow_dispatch:  # 필요한 경우 수동으로 실행할 수도 있도록 합니다

jobs:
  deploy:
    runs-on: ubuntu-latest  # CI/CD 파이프라인이 실행될 운영체제 환경을 지정합니다
    steps:
      - TODO
```

GitHub Aciton은 Job 내부의 여러 단계의 Step을 거쳐 실행됩니다. 각 Step에는 원하는 스크립트를 실행하거나, 원하는 Action을 가져와 이용할 수 있습니다.

꼭 배포 뿐 아니라 AWS로 이메일을 보낸다거나 하는 작업도 할 수 있습니다.

위의 설정은 해당 액션의 이름과 언제 이 액션이 동작할지에 대한 정의만 해둔 상태입니다. 일단 이 상태에서 `main` 브랜치에 머지해보도록 하겠습니다.

```bash
git add .
git commit -m "커밋 메시지"
git push origin feature/add-deploy-pipeline
```

저는 `feature/add-deploy-pipeline` 브랜치를 사용했기 때문에 위 명령어를 이용해 푸시하고, GitHub에서 PR을 생성해보도록 하겠습니다.

![CleanShot 2024-09-17 at 02.15.35@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_02.15.352x.png)

원래 실제 협업에서는 PR 후 코드 리뷰를 하고 리뷰가 완료되면 머지해야 합니다. `Reviewers`에서 다른 개발자들을 추가하여 리뷰 요청을 보내고, 리뷰를 받은 후 머지해야 합니다. (마음대로 머지했다가 혼날 수도..!)

하지만 UMC에서는 바로 PR을 생성하고 머지를 진행해보도록 하겠습니다.

머지를 한 후 상단의 `Actions` 탭을 눌러 들어가보면, 이렇게 파이프라인이 바로 실패한 것을 볼 수 있습니다. 이는 정상이니 우선 트리거는 잘 되었구나만 보고 넘어가시면 됩니다.

![CleanShot 2024-09-17 at 02.17.20@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_02.17.202x.png)

### 2. EC2에서 필요한 패키지 설치하기 (Ubuntu)

> 해당 실습은 인스턴스 유형이 Ubuntu인 EC2를 사용하기 때문에, 다른 인스턴스 유형을 사용하신다면, 해당 인스턴스 유형에 맞는 명령어를 사용해주셔야 합니다!!!
> 

서버를 정상적으로 실행하기 위해, 서버에 필요한 몇 가지 패키지를 설치하도록 하겠습니다. 우리는 이번 실습에서 **MySQL**을 데이터베이스로 사용합니다. 실제로는 **RDS**나 다른 데이터베이스 서비스를 활용할 수 있지만, 이번 실습의 목적이 **CI/CD 구축**이므로, 데이터베이스는 **EC2에 직접 설치**하여 간단히 사용하겠습니다.

우선 Node.js가 필요한데, 아래 명령어를 입력해서 설치해주세요.

로컬 컴퓨터 터미널이 아니라, SSH로 EC2에 접속한 상태에서 입력해야 합니다. 

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

위의 `curl ~` 명령어를 실행하지 않으면 Node.js v18 버전이 설치될 수 있으니 주의해주세요!

다음은 MySQL 서버를 설치해보도록 하겠습니다.

```bash
sudo apt install -y mysql-server
```

그리고 아래 명령어를 통해 MySQL 서버가 잘 접속되는지 확인해주세요.

```bash
sudo mysql -u root
```

![CleanShot 2024-09-17 at 02.25.51@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_02.25.512x.png)

지금은 비밀번호 없이 `root` 계정에 접속했지만, 보안을 위해 원하는 비밀번호를 설정해보도록 하겠습니다. 먼저 MySQL에 접속한 후, `root` 비밀번호를 설정하고 데이터베이스를 생성합니다.

```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'randompassword';
CREATE DATABASE umc_9th;
```

![CleanShot 2024-09-17 at 02.27.21@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_02.27.212x.png)

그리고 `exit`을 입력해 MySQL Shell에서 나갈 수 있습니다. **여기에서 변경한 비밀번호는 반드시 다른 곳에 저장해두거나 해서 기억하고 계셔야 합니다!**

### 3. GitHub Actions 설정을 위한 Secrets 설정하기

GitHub 저장소로 돌아가보겠습니다!

GitHub Actions 파이프라인에 EC2 서버의 주소, SSH PEM 키 내용까지 모두 하드 코딩하여 넣을 수는 없으므로, GitHub Actions에서는 Repository Secret을 사용하여 안전하게 관리할 수 있습니다.

![CleanShot 2024-09-17 at 02.28.58@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_02.28.582x.png)

- `EC2_HOST`: EC2 인스턴스와 연결된 탄력적 IP 주소를 입력해주세요.
- `EC2_SSH_KEY`: EC2 인스턴스에 접근할 수 있는 SSH PEM 키 페어 파일 내용을 넣어주시면 됩니다.
    
    ```bash
    -----BEGIN RSA PRIVATE KEY-----
    ...
    -----END RSA PRIVATE KEY-----
    ```
    

![CleanShot 2024-09-17 at 12.25.21@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_12.25.212x.png)

### 4. GitHub Actions 설정하기

이제 `.github/workflows/deploy-main.yml` 파일을 제대로 작성해서, GitHub Actions가 자동으로 EC2에 서버를 배포할 수 있도록 설정해보겠습니다.

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

      - name: Configure SSH
        run: |
          mkdir -p ~/.ssh
          echo "$EC2_SSH_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa

          # 접속 별명 설정
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
          ssh umc9thworkbook 'npm install --prefix /opt/app/'

      - name: Copy systemd service file
        run: |
          ssh umc9thworkbook '
            echo "[Unit]
            Description=UMC 9th Project
            After=network.target

            [Service]
            User=ubuntu
            ExecStart=/usr/bin/npm run dev --prefix /opt/app/
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

이 파이프라인은 GitHub Actions에서 `main` 브랜치에 푸시가 발생하면, 자동으로 코드를 EC2에 복사하고 의존성을 설치한 후 실행하는 작업을 진행합니다.

### 5. 배포

`main` 브랜치에 새로운 PR을 머지하고 기다리면, 노란 불이 돌다가 초록 불이 들어오는 것을 보실 수 있습니다.

![CleanShot 2024-09-17 at 14.03.29@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_14.03.292x.png)

실행 중, 또는 실행 완료된 파이프라인을 눌러서 들어가면 실행 로그도 확인할 수 있습니다.

![CleanShot 2024-09-17 at 14.04.10@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_14.04.102x.png)

이제 GitHub Action이 성공적으로 동작했으니, 이번엔 EC2에서 정상적으로 실행되고 있는지 확인해보겠습니다.

- 스왑 메모리 설정하기 (깃허브 액션이 자꾸 실패해요)
    
    아마 여러분들은 프리티어 서버를 사용하고 계실텐데요.
    
    AWS 프리티어(t2.micro, t3.micro)는 **RAM이 1GB**밖에 되지 않습니다.
    그런데 Node.js의 `npm install`이나 빌드 과정은 메모리를 많이 잡아먹기 때문에, 배포 도중에 **메모리 부족으로 서버가 멈추거나(Freezing) 연결이 끊길 수 있습니다.**
    
    이럴 때 하드디스크의 일부를 RAM처럼 사용하는 '스왑 메모리(Swap Memory)’ 를 설정하면 해결됩니다.
    
    **터미널에 아래 명령어들을 한 줄씩(혹은 통째로) 복사해서 입력해주세요.**
    
    ```jsx
    # 1. 2GB 스왑 파일 생성 (하드디스크를 램처럼 사용)
    sudo fallocate -l 2G /swapfile
    
    # 2. 권한 설정 (루트 사용자만 접근 가능하게)
    sudo chmod 600 /swapfile
    
    # 3. 스왑 공간으로 지정
    sudo mkswap /swapfile
    
    # 4. 스왑 활성화
    sudo swapon /swapfile
    
    # 5. 재부팅해도 설정이 유지되도록 등록
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    ```
    
    이러면 더이상 터지지 않을거에요 💪
    

### 6. 최초 구성 채워주기

EC2에 다시 SSH로 원격 접속하여, 다음 명령어를 입력해보면,

```bash
sudo systemctl status app
```

![CleanShot 2024-09-17 at 14.08.02@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_14.08.022x.png)

실행 중인 것처럼 보이지만, 아래 쪽의 로그를 살펴보면 오류가 발생해 실패한 것을 볼 수 있습니다. 저희가 새로 생성한 **환경 변수**가 없고, **DB에도 테이블들**이 하나도 없기 때문입니다.

- 환경 변수 채우기
    
    우선 환경 변수는, SSH로 연결된 VSCode에서 직접 `.env` 파일을 생성해주시면 됩니다. EC2 내에는 저희의 코드가 `/opt/app` 경로에 있는데, `/opt/app/.env` 파일을 생성해 내용을 채워주면 됩니다.
    
    ```jsx
    PORT=3000
    
    DATABASE_URL="mysql://root:<설정한비번>@localhost:3306/umc_9th"
    
    PASSPORT_GOOGLE_CLIENT_ID="<구글 클라우드에서 받은 ID>"
    
    PASSPORT_GOOGLE_CLIENT_SECRET="<구글 클라우드에서 받은 Secret>"
    
    JWT_SECRET="<내가설정한jwt>"
    ```
    
- DB 채우기
    
    다음으로, DB는 로컬 환경에서 아래 주소로 접근할 수 있습니다.
    
    > `http://<EC2_PUBLIC_IP>:3306`
    > 
    
    해당 주소의 DB에 접근해 테이블들을 생성해주세요.  [2. EC2에서 필요한 패키지 설치하기 (Ubuntu)](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)%202bfb57f4596b81dcbc61d16ba9fc8444.md) 에서 수정한 비밀번호를 이용해주시면 됩니다.
    

그리고 프로세스를 다시 시작한 후 로그를 확인해보면,

```bash
sudo systemctl restart app
sudo systemctl status myapp
```

![CleanShot 2024-09-17 at 14.01.52@2x.png](Chapter%2010%20CI%20CD%20%EB%B0%B0%ED%8F%AC%20%EC%9E%90%EB%8F%99%ED%99%94%20(GitHub%20Actions%20+%20AWS%20EC2)/CleanShot_2024-09-17_at_14.01.522x.png)

이렇게 정상적으로 돌아가고 있는걸 볼 수 있습니다.

그렇다면, 이제 한번 웹브라우저로 접속해보겠습니다. 현재 저희는 따로 도메인이나 HTTPS 설정을 하지 않았기 때문에 아래와 같이 접속합니다.

> `http://<EC2_PUBLIC_IP>:3000`
> 

다른 API들도 잘 동작하는지 테스트해보세요!

### 7. Google 로그인 테스트

저희가 저번에 구현했던 Google 로그인도 잘 동작하나요?

로그인을 시도하면 Google 로그인을 한 후, `http://localhost:3000/oauth2/callback/google` 으로 이동할텐데요, 로컬에 서버를 띄워두지 않는 이상 동작하지 않는 것을 알 수 있습니다. 😢

이 부분은 미션으로 직접 수정해보시기 바랍니다. 🙏 (코드의 수정, Google Cloud Platform 콘솔에서의 수정 모두 필요할 것 같네요!)

### 8. HTTPS, 도메인 설정 Nginx 등

현재 우리는 EC2에서 애플리케이션을 HTTP로 실행하고 있지만, 실제 서비스 환경에서는 **HTTPS**를 통해 보안을 강화해야 합니다.

또한, **도메인 설정**을 통해 사용자들이 **도메인 이름**으로 서비스를 이용할 수 있도록 할 수 있습니다. 이때, **Nginx** 등을 사용해 **Reverse Proxy** 설정을 추가하면 더 안전하고 효율적인 서비스를 운영할 수 있습니다

이런 **HTTPS 설정**, **도메인 설정**, 그리고 **Nginx** 같은 **리버스 프록시** 설정은 실제 서비스 운영 시 중요한 부분입니다. 이러한 부분은 한 번 스스로 공부해보고 직접 적용해보는 것을 추천드립니다.