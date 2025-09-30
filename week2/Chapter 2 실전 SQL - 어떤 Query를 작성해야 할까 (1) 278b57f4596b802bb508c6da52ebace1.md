# Chapter 2. 실전 SQL - 어떤 Query를 작성해야 할까? (1)

## 📝 학습 목표

---

1. 1주차 때 예시를 기반으로 여러가지 요구 사항에 대한 SQL 쿼리를 고민한다.
2. paging을 고려하여 쿼리를 작성한다.

## 📸 잠깐 ! 스터디 인증샷은 찍으셨나요?📸

---

* 스터디리더께서 대표로 매 주차마다 한 장 남겨주시면 좋겠습니다!🙆💗
 (사진을 저장해서 이미지 임베드를 하셔도 좋고, 복사+붙여넣기해서 넣어주셔도 좋습니다!)

[](https://www.notion.so)

## 📑 2주차 주제

---

다들 데이터베이스 설계(1주차 미션)는 잘 하셨나요?

- 저 같은 경우는 아래의 형태로 설계를 했습니다. (참고해주세요!)
    
    ❗1주차 미션에 포함되지 않는 부분은 설계를 하지 않았습니다!
    
    ![1주차 미션 ERD](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/image.png)
    
    1주차 미션 ERD
    
    글씨가 잘 보이지 않는다면 링크를 참고하시면 됩니다! 
    
    [umc9th2week](https://www.erdcloud.com/d/k7phBagbMpAeiTZBj)
    

이번 주차는 **몇 가지 요구 사항에 대해 어떻게 쿼리를 만들어야 하는지 같이 고민**해보는 주차입니다.

***join, subquery는 알고 있다는 전제로 시작합니다!***

- 참고 자료
    
    [SQL 기본 문법: JOIN(INNER, OUTER, CROSS, SELF JOIN)](https://hongong.hanbit.co.kr/sql-기본-문법-joininner-outer-cross-self-join/)
    
    [[SQL] 테이블 JOIN의 개념과 예제](https://velog.io/@wijoonwu/JOIN)
    
    [[MYSQL] 📚 테이블 조인(JOIN) - 그림으로 알기 쉽게 정리](https://inpa.tistory.com/entry/MYSQL-📚-JOIN-조인-그림으로-알기쉽게-정리)
    
    [SQL / MySQL 서브쿼리(SubQuery)](https://snowple.tistory.com/360)
    
    [[MYSQL] 📚 서브쿼리 개념 & 문법 💯 정리](https://inpa.tistory.com/entry/MYSQL-📚-서브쿼리-정리)
    

😉 ***mysql 기준으로 진행합니다.***

## 🔖 2주차 본문

---

기존 1주차 워크북 본문서 요구하던 요구 사항,
그리고 전 미션(1주차 미션)에서 요구했던 요구 사항 일부에 대해

**어떻게 쿼리를 만드는 것이 좋을지 고민**을 해봅시다.

query 역시 Database 설계처럼 **정해진 답이 없고**,
**join을 사용할 지 혹은 subquery를 사용할 지 선택**하시면 됩니다!

그리고 너무 무리해서 **한번에 거대한 query를 보내기 보다는 힘들 경우,
2개로 쪼개서 보내는 것**도 좋습니다.

특히 복잡한 쿼리를 작성할 때는 같은 쿼리라도 어떤 쿼리가 더 효율적인지 여러 가지 테스트 방법을 통해서 확인하는 것도 좋습니다. 

워낙 ORM과 같은 도구들이 우리를 편하게 해주긴 하지만, 그럼에도 불구하고 직접 쿼리 짜는 연습을 해두면 그 노력이 언젠가 빛을 발할 날이 있을 거에요. 

### 🔮 SQL 마스터 도전

<aside>
💡 본격적으로 어떤 쿼리가 좋은 쿼리인지 고민해보기 전에, 예제로 워밍업을 해봅시다!

</aside>

[Chapter 2. 실전 SQL- 워밍업 ](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL-%20%EC%9B%8C%EB%B0%8D%EC%97%85%20278b57f4596b81f4b493d936d309bd6c.md)

### 💜 여러 요구 사항에 대응하기

<aside>
💡 워밍업 했던 내용들을 토대로 여러 요구 사항에 대응하는 쿼리를 짜봅시다.

</aside>

[Chapter 2. 실전 SQL- 어떤 Query를 작성해야 할까? ](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20278b57f4596b816f8623d13cd7d3760f.md)

### 💟 페이지네이션 배워보기

<aside>
💡 Offset 기반 페이징과 Cursor 기반 페이징에 대해 배워봅시다.

</aside>

[Chapter 2. 실전 SQL- SQL과 페이지네이션 ](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL-%20SQL%EA%B3%BC%20%ED%8E%98%EC%9D%B4%EC%A7%80%EB%84%A4%EC%9D%B4%EC%85%98%20278b57f4596b81dc9a72ec454956e66f.md)

## ✍️ 2주차를 마치며

---

수고하셨습니다 :) 이 내용은 가볍게 읽고 넘어가 볼게요. 다음주도 화이팅! 

### 👾 쿼리 실행 흐름

<aside>
💡 쿼리는 서버에 어떻게 반영되는 걸까요?

</aside>

[Chapter 2 BOUNS. 내가 짠 쿼리는 어떻게 반영되는걸까? ](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/Chapter%202%20BOUNS%20%EB%82%B4%EA%B0%80%20%EC%A7%A0%20%EC%BF%BC%EB%A6%AC%EB%8A%94%20%EC%96%B4%EB%96%BB%EA%B2%8C%20%EB%B0%98%EC%98%81%EB%90%98%EB%8A%94%EA%B1%B8%EA%B9%8C%20278b57f4596b818ab1ddc928e1661697.md)

# 🎯 핵심 키워드

---

<aside>
💡 주요 내용들에 대해 조사해보고, 자신만의 생각을 통해 정리해보세요!
레퍼런스를 참고하여 정의, 속성, 장단점 등을 적어주셔도 됩니다.
조사는 공식 홈페이지 **Best**, 블로그(최신 날짜) **Not Bad**

</aside>

- 데이터베이스 정규화
    
    테이블을 여러 개로 분리하여 중복을 줄이고 이상현상(삽입/갱신/삭제 문제)을 방지하는 과정
    
- 인덱스(Index)
    
    특정 컬럼에 별도의 자료구조를 만들어 조회 성능을 높인다.
    
    WHERE, JOIN, ORDER BY 조건에 자주 쓰이는 컬럼에 활용한다
    
- ORM VS Raw SQL
    - ORM: 객체지향적으로 DB를 다루며 CRUD를 쉽게 구현
        - → 빠른 개발 및 유지보수에 유리하다
    - Raw SQL: SQL을 직접 작성해 세밀한 제어와 성능 최적화
        - → 대용량 데이터 처리나 복잡한 쿼리에 적합하다

## 📢 학습 후기

---

- 이번 주차 워크북을 해결해보면서 어땠는지 회고해봅시다.
- 핵심 키워드에 대해 완벽하게 이해했는지? 혹시 이해가 안 되는 부분은 뭐였는지?

<aside>
💡

</aside>

## ⚠️ 스터디 진행 방법

---

1. 스터디를 진행하기 전, 워크북 내용들을 모두 채우고 스터디에서는 서로 모르는 내용들을 공유해주세요.
2. 미션은 워크북 내용들을 모두 완료하고 나서 스터디 전/후로 진행해보세요.
3. 다음주 스터디를 진행하기 전, 지난주 미션을 서로 공유해서 상호 피드백을 진행하시면 됩니다.

## ✅ 실습 체크리스트

---

- [x]  SQL 마스터 도전
- [x]  여러 요구 사항에 대응하기
- [x]  페이지네이션 배워보기
- [x]  쿼리 실행 흐름 알아보기

## ☑️ 실습 인증

---

## ✨ 위클리 스크럼 과제

---

위클리 스크럼 과제는 OO주차 위클리 스크럼 아이스 브레이킹과 공통 질문을 모두 작성한 후, 아래에 질문을 복사 붙여넣기 한 다음 다같이 작성해주시면 됩니다. 

1. ERD를 설계할 때 N:M 관계를 설계해야 할 일이 많은데 어떤 기준으로 매핑 테이블을 설계했나요?
2. DB를 설계하면서 처음에 그린 ERD에서 바뀐 부분이 있었나요? 어떤 부분이었고 왜 바꿨나요? 

## 🔥 미션

---

1. 1주차 때 설계한 데이터베이스를 토대로 아래의 화면에 대한 쿼리를 작성

![내가 진행중, 진행 완료한 미션 모아서 보는 쿼리(페이징 포함)](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/Untitled.png)

내가 진행중, 진행 완료한 미션 모아서 보는 쿼리(페이징 포함)

![리뷰 작성하는 쿼리,
* 사진의 경우는 일단 배제](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/Untitled%201.png)

리뷰 작성하는 쿼리,
* 사진의 경우는 일단 배제

![홈 화면 쿼리
(현재 선택 된 지역에서 도전이 가능한 미션 목록, 페이징 포함)](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/Untitled%202.png)

홈 화면 쿼리
(현재 선택 된 지역에서 도전이 가능한 미션 목록, 페이징 포함)

![마이 페이지 화면 쿼리](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/Untitled%203.png)

마이 페이지 화면 쿼리

**< 시니어 미션 >**

[시니어 미션](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/%EC%8B%9C%EB%8B%88%EC%96%B4%20%EB%AF%B8%EC%85%98%20278b57f4596b81808e68fe6f1bc27f11.md)

## 💪 미션 기록 (여기에 해도 되고 위의 미션에서 각 페이지 밑에 간단하게 블록 만들어서 하셔도 됩니다!)

---

<aside>
🍀 미션 기록의 경우, 아래 미션 기록 토글 속에 작성하시거나, 페이지를 새로 생성하여 해당 페이지에 기록하여도 좋습니다!

하지만, 결과물만 올리는 것이 아닌, **중간 과정 모두 기록하셔야 한다는 점!** 잊지 말아주세요.

</aside>

- **미션 기록**
    - 테이블 생성 쿼리
        
        ```sql
        CREATE TABLE member (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(20),
            gender VARCHAR(20),
            age INT,
            address VARCHAR(40),
            spec_address VARCHAR(40),
            status VARCHAR(15),
            inactive_date DATETIME,
            social_type VARCHAR(10),
            created_at DATETIME(6),
            updated_at DATETIME(6),
            email VARCHAR(50),
            point INT
        );
        
        CREATE TABLE terms (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(20),
            body TEXT,
            optional BOOLEAN,
            created_at DATETIME(6),
            updated_at DATETIME(6)
        );
        
        CREATE TABLE member_agree (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            member_id BIGINT,
            terms_id BIGINT,
            created_at DATETIME(6),
            updated_at DATETIME(6),
            FOREIGN KEY (member_id) REFERENCES member(id),
            FOREIGN KEY (terms_id) REFERENCES terms(id)
        );
        
        CREATE TABLE region (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(20),
            created_at DATETIME(6),
            updated_at DATETIME(6)
        );
        
        CREATE TABLE store (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            region_id BIGINT,
            name VARCHAR(30),
            address VARCHAR(50),
            score FLOAT,
            created_at DATETIME(6),
            updated_at DATETIME(6),
            FOREIGN KEY (region_id) REFERENCES region(id)
        );
        
        CREATE TABLE mission (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            store_id BIGINT,
            reward INT,
            deadline DATETIME,
            mission_spec TEXT,
            created_at DATETIME(6),
            updated_at DATETIME(6),
            FOREIGN KEY (store_id) REFERENCES store(id)
        );
        
        CREATE TABLE member_mission (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            member_id BIGINT,
            mission_id BIGINT,
            status VARCHAR(13),
            created_at DATETIME(6),
            updated_at DATETIME(6),
            FOREIGN KEY (member_id) REFERENCES member(id),
            FOREIGN KEY (mission_id) REFERENCES mission(id)
        );
        
        CREATE TABLE food_category (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(15),
            created_at DATETIME(6),
            updated_at DATETIME(6)
        );
        
        CREATE TABLE member_prefer (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            member_id BIGINT,
            category_id BIGINT,
            created_at DATETIME(6),
            updated_at DATETIME(6),
            FOREIGN KEY (member_id) REFERENCES member(id),
            FOREIGN KEY (category_id) REFERENCES food_category(id)
        );
        
        CREATE TABLE review (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            member_id BIGINT,
            store_id BIGINT,
            body TEXT,
            score FLOAT,
            created_at DATETIME(6),
            updated_at DATETIME(6),
            FOREIGN KEY (member_id) REFERENCES member(id),
            FOREIGN KEY (store_id) REFERENCES store(id)
        );
        
        CREATE TABLE review_image (
            id BIGINT AUTO_INCREMENT PRIMARY KEY,
            review_id BIGINT,
            image_url TEXT,
            created_at DATETIME(6),
            updated_at DATETIME(6),
            FOREIGN KEY (review_id) REFERENCES review(id)
        );
        ```
        
    - 내가 진행중/완료한 미션 조회
        
        **`서브쿼리 > 인라인 뷰`**
        
        ```sql
        SELECT mm_view.member_mission_id,
               mm_view.mission_id,
               mm_view.store_name,
               mm_view.reward,
               mm_view.status,
               mm_view.created_at
        FROM (
            SELECT mm.id AS member_mission_id,
                   m.id AS mission_id,
                   (SELECT s.name FROM store s WHERE s.id = m.store_id) AS store_name,
                   m.reward,
                   mm.status,
                   mm.created_at
            FROM member_mission mm
            WHERE mm.member_id = :memberId
              AND mm.status IN ('진행중', '진행완료')
        ) mm_view
        -- 이름이 없는 가상 테이블이기 때문에 AS가 필요하다. (실제 존재하지 않는다)
        -- 인라인뷰는 임시로 생성되는 테이블을 사용하는 방법이다.
        ORDER BY mm_view.created_at DESC
        LIMIT :limit OFFSET :offset;
        ```
        
        한 페이지에 보이는 개수를 10개로 제한하고 싶다면 Node.js에서 아래와 같이 계산해서 바인딩해줘야 한다.
        
        ```jsx
        limit = 10;
        offset = (page - 1) * limit;
        ```
        
    - 리뷰 작성
        
        ```sql
        INSERT INTO review (member_id, store_id, body, score, created_at, updated_at)
        VALUES (:memberId, :storeId, :body, :score, NOW(), NOW());
        -- created_at, updated_at 은 NOW()를 디폴트값으로 해두는게 좋다
        -- 조인쿼리와 서브쿼리는 가독성 차이 취향껏 쓰면 됨
        ```
        
    - 홈화면 쿼리
        
        **`서브쿼리 > 스칼라 서브쿼리, 중첩 서브쿼리`**
        
        ```sql
        SELECT m.id AS mission_id,
               **(SELECT s.name FROM store s WHERE s.id = m.store_id) AS store_name,**
               m.reward,
               m.deadline,
               m.mission_spec
        FROM mission m
        **WHERE m.store_id IN (
                  SELECT s.id FROM store s WHERE s.region_id = :regionId
              )**
          AND m.deadline > NOW()
        ORDER BY m.created_at DESC
        LIMIT :limit OFFSET :offset;
        ```
        
    - 마이페이지 쿼리
        
        **`서브쿼리 > 스칼라 서브쿼리`**
        
        ```sql
        SELECT mem.id,
               mem.name,
               mem.email,
               mem.point,
               (SELECT COUNT(*) 
                  FROM member_mission mm 
                 WHERE mm.member_id = mem.id) AS total_missions,
               (SELECT COUNT(*) 
                  FROM member_mission mm 
                 WHERE mm.member_id = mem.id
                   AND mm.status = '미션완료') AS completed_missions,
               (SELECT COUNT(*) 
                  FROM review r 
                 WHERE r.member_id = mem.id) AS total_reviews
        FROM member mem
        WHERE mem.id = :memberId;
        ```
        

## ⚡ 트러블 슈팅

---

<aside>
💡 실습하면서 생긴 문제들에 대해서, **이슈 - 문제 - 해결** 순서로 작성해주세요.

</aside>

<aside>
💡 스스로 해결하기 어렵다면? 스터디원들에게 도움을 요청하거나 **너디너리의 지식IN 채널에 질문**해보세요!

</aside>

- ⚡이슈 작성 예시 (이슈가 생기면 아래를 복사해서 No.1, No.2, No3 … 으로 작성해서 트러블 슈팅을 꼭 해보세요!)
    
    **`이슈`**
    
    👉 앱 실행 중에 노래 다음 버튼을 누르니까 앱이 종료되었다.
    
    **`문제`**
    
    👉 노래클래스의 데이터리스트의 Size를 넘어서 NullPointException이 발생하여 앱이 종료된 것이었다. 
    
    **`해결`**
    
    👉  노래 다음 버튼을 눌렀을 때 데이터리스트의 Size를 검사해 Size보다 넘어가려고 하면 다음으로 넘어가는 메서드를 실행시키지 않고, 첫 노래로 돌아가게끔 해결
    
    **`참고레퍼런스`**
    
    - 링크
- ⚡이슈 No.1
    
    **`이슈`**
    
    👉 [트러블이 생긴 상태 작성]
    
    **`문제`**
    
    👉 [어떤 이유로 해당 이슈가 일어났는지 작성]
    
    **`해결`**
    
    👉  [해결 방법 작성]
    
    **`참고레퍼런스`**
    
    - [문제 해결 시 참고한 링크]
- 서브쿼리
    
    ### **1️⃣ 중첩 서브쿼리**
    
    - 주로 WHERE, HAVING, FROM 문에서 사용
    
    ```sql
    -- 직원 테이블(emp)에서, 가장 높은 급여를 받는 직원의 이름 조회
    SELECT name, salary
    FROM emp
    **WHERE salary = (SELECT MAX(salary) FROM emp);**
    ```
    
    ### **2️⃣ 인라인뷰**
    
    - FROM 문 안에서 서브쿼리를 테이블처럼 사용
    - 서브 쿼리가 FROM 절에 사용된 경우, **무조건 AS 별칭을 지정해줘야 한다.**
    
    ```sql
    -- 부서별 평균 급여를 구하고, 평균 급여가 3000 이상인 부서 조회
    SELECT dept_id, avg_salary
    FROM (
        **SELECT dept_id, AVG(salary) AS avg_salary
        FROM emp
        GROUP BY dept_id
    ) AS dept_avg**
    WHERE avg_salary >= 3000;
    ```
    
    ### **3️⃣ 스칼라 서브쿼리**
    
    - SELECT 문에 나타나는 서브쿼리
    - 다른 테이블에서 어떠한 값을 가져올 때 쓰인다
    - 하나의 레코드만 리턴이 가능하다. (두개 이상 불가능)
    
    ```sql
    -- 각 직원 이름과 부서 평균 급여 함께 조회
    SELECT name,
           salary,
           **(SELECT AVG(salary) 
            FROM emp 
            WHERE dept_id = e.dept_id)** AS dept_avg_salary
    FROM emp e;
    ```
    

## 🤔 참고 자료

[2주차](Chapter%202%20%EC%8B%A4%EC%A0%84%20SQL%20-%20%EC%96%B4%EB%96%A4%20Query%EB%A5%BC%20%EC%9E%91%EC%84%B1%ED%95%B4%EC%95%BC%20%ED%95%A0%EA%B9%8C%20(1)%20278b57f4596b802bb508c6da52ebace1/2%EC%A3%BC%EC%B0%A8%20278b57f4596b81159f9fc19ba2379148.csv)

---

Copyright © 2023 최용욱(똘이) All rights reserved.

Copyright © 2024, 2025 제이미(김준환) All rights reserved.

Copyright © 2025 전하경(재서) All rights reserved.