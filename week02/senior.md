- [x] 미션 1(내가 진행중, 진행 완료한 미션 모아서 보는 쿼리(페이징 포함))에서 정렬 기준을 1순위는 포인트로 2순위는 최신순으로 하여 Cursor기반 페이지네이션을 구현해보세요
  - 설명
    ## 쿼리
    ```sql
    -- 진행 중인 미션
    select * from (select accepted_mission.id, r.name, m.goal, m.reward, concat(lpad(cast(UNIX_TIMESTAMP(accepted_at) as unsigned ),10,'0'),
    lpad(reward,10,'0')) as `cursor` from accepted_mission join mission m on m.id = accepted_mission.mission_id
    join restaurant r on r.id = restaurant_id where completed_at is null and user_id = <유저ID>) as ammr
    where ammr.`cursor` > <시작 커서값> order by `cursor` desc limit <갯수>;
    -- 진행 완료한 미션
    select * from (select accepted_mission.id, r.name, m.goal, m.reward, concat(lpad(cast(UNIX_TIMESTAMP(completed_at) as unsigned ),10,'0'),
    lpad(reward,10,'0')) as `cursor` from accepted_mission join mission m on m.id = accepted_mission.mission_id
    join restaurant r on r.id = restaurant_id where completed_at is not null and user_id = <유저ID>) as ammr
    where ammr.`cursor` > <시작 커서값> order by `cursor` desc limit <갯수>;
    ```
    > 진행 중인 미션은 가장 나중에 수락한 최신 미션일수록, 그 다음 포인트 금액이 클수록 가장 먼저 나열되도록 정렬, 완료된 미션에서는 가장 최근에 완료된 미션일수록 가장 먼저 나열되도록 정렬, 시작 커서값으로 해당 커서값보다 작은 값을 필터링하고 limit <갯수> 를 이용하여 커서 기반 페이지네이션을 구현하였습니다.
- [x] SQL Injection에 대해 조사하고 어떠할 때 일어나고 어떻게 막을 수 있는 지를 적어주세요

  - 설명

    > 이미 블로그에 관련해서 작성해둔 글이 있어서 첨부합니다.
    > https://hoshi2710.github.io/dreamhack/DH-baby-sqlite.html

    SQL Injection이란 개발자가 의도하지 않은 명령어를 클라이언트 단에서 삽입하여 DB를 조작하거나 정보를 탈취하는 기법을 의미합니다.
    `select * from user where id=<유저ID> and pw=<유저PW>`
    어떤 사이트에서 로그인을 진행할때 발생하는 쿼리문이 위와 같다고 가정해봅시다.
    유저가 입력필드에 ID와 PW를 입력하면 위 쿼리의ID와 PW자리에 해당값이 입력된체 쿼리가 실행 될 것입니다. 예를들어 ID가 umc, pw를 test를 입력하면 아래와 같은 쿼리문이 실행됩니다.
    `select * from user where id='umc' and pw='test'`
    이와 같이 이런 일반적인 입력 값에 이 쿼리는 아무 문제가 없을 것입니다. 그러나 만약 id필드에  
     umc’ —, pw필드를 ‘test’라고 입력하면 어떻게 될까요?
    아마 아래와 같은 쿼리가 만들어질 것입니다.
    `select * from user where id=’umc’—’ and pw=’test’`
    이 코드를 보게 되면 — 라는 문자를 볼수있는데 이 문자는 이 이후에 나오는 모든 문자열을 주석 처리를 해달라는 의미입니다. 이렇게 되면 ‘umc’ 뒷쪽으로 있는 모든 문자열이 무력화 되게 됩니다.
    따라서 실질적으로 실행되는 쿼리문은 다음과 같습니다.
    `select * from user where id=’umc’`
    이렇게 되면 패스워드 검증 로직없이 오직 아이디만으로 로그인이 가능한 상태가 되는 것입니다.
    이렇게 umc라는 계정을 패스워드를 모른체 로그인이 가능하게 되는 것입니다.
    이것이 SQL Injection의 공격 플로우 입니다.
    이를 방지하기 위해서는 아래와 같은 방법을 활용해 볼 수 있습니다.

    1. 정규식, 조건문등을 이용하여 악의적인 입력을 필터링 하기
    2. 파라미터 바인딩을 이용하여 쿼리를 조합할때 문자열로 입력값을 문자열로 직접 조합하는 것이 아닌 자리 표시자를 두고 입력값을 나중에 안전하게 주입하도록 코드 구현하기
    3. Raw Query보다 ORM을 위주로 DB를 제어하기

- [x] 다양한 JOIN 방법들에 대해 찾아보고, 각 방식에 대해 비교하여 간단히 정리해주세요.
  - 설명
    ## JOIN 종류 (MySQL 기준)
    - Inner Join
    - Outer Join
      - Left Join
      - Right Join
    - Cross Join
      > RDBMS에 따라서 지원하는 Join 종류가 다를 수 있습니다.
    ## Inner Join
    두 테이블의 교집합으로 보면 된다.
    일반적으로 sql에서 JOIN이라고만 적으면 대체로 Inner Join을 의미하는게 된다.
    ### 예시 쿼리
    ```sql
    select * from favorite_food inner join user u on u.id = favorite_food.user_id = u.id
    ```
    위와 같은 쿼리를 통해 각 유저의 선호 음식 카테고리 번호와 각 유저 의 정보를 동시에 가져올 수 있습니다.
    ## Outer Join
    ### Left Join
    두 테이블을 join하되 왼쪽 테이블의 모든 값이 출력되도록 하는 join 이다.
    만약 join했을때 왼쪽테이블을 기준으로 오른쪽 테이블에 매칭되는 레코드가 없다면 join했을때 오른쪽 테이블에 관한 컬럼은 모두 null로 보여지게 된다.
    **예시 쿼리**
    ```sql
    select * from mission left join
    (select * from accepted_mission where user_id=1) am
    on mission.id = am.mission_id where accepted_at is null
    ```
    위와 같은 쿼리를 통해 유저가 아직 도전하지 않은 미션 목록을 가져올 수 있습니다.
    ### Right Join
    두 테이블을 Join 하되 오른쪽 테이블의 모든 값이 출력되도록하는 join 이다.
    Left Join과 비슷하게 오른쪽 테이블을 기준으로 왼쪽 테이블에 매칭되는 레코드가 없다면 join했을때 왼쪽 테이블에 관한 컬럼은 모두 null로 보여지도록 처리되게 된다.
    **예시 쿼리**
    ```sql
    select * from (select * from accepted_mission where user_id = 1)am
    right join mission m on m.id = am.id where accepted_at is null;
    ```
    Left Join과 동일하게 Right Join으로도 순서를 바꿔서 진행하면 동일한 결과값을 얻을 수 있습니다.
    ## Cross Join
    한쪽 테이블의 모든행과 다른쪽 테이블의 모든 행을 조인시키는 기능입니다.
    Join을 하게 되면 전체 행 개수는 두 테이블의 각 행의 개수를 곱한 수 만큼 출력되게 됩니다.
    ### 예시 쿼리
    ```sql
    select * from user cross join mission;
    ```
    위 쿼리문을 이용하여 모든 유저가 수행할수 있는 미션의 경우의 수를 모두 구할 수 있습니다.

정리된 글을 바탕으로 블로그를 작성하여 주세요

https://hoshi2710.github.io/umc/umc-9th-nodejs-week02.html
