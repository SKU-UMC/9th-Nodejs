# Chapter 6. ORM 사용해보기 - 목록 API 만들어보기

<aside>
<img src="https://www.notion.so/icons/list_gray.svg" alt="https://www.notion.so/icons/list_gray.svg" width="40px" /> **목차**

</aside>

### 👉 어떤 방법을 사용할 지 고민해보기

2주차 실전 SQL 워크북에서도 말씀드렸듯, 조회 기능은 성능에 큰 영향을 미칩니다. 기억 나시나요?

한 번에 모든 리뷰를 조회한다면 불러오는 데 시간이 많이 걸리는 등의 문제가 발생할 거에요. 우리는 이전에 이를 해결하기 위한 방법을 언급했었고, 직접 SQL 쿼리도 짜 봤었습니다.

그래서 이번에 페이지네이션을 사용할 예정이에요! 그 때, 함께 공부했던 페이지네이션 방법의 종류로는 2개가 있었죠.

그 중 여러분들은 어떤 페이지네이션 방법을 사용하실 건가요? 한 번 잘 생각해보시고, 아래 상자에 어떤 기법을 사용할 것인지, 왜 이것을 선택했는지 한 번 적어봅시다.

<aside>
📝 어떤 페이지네이션 방법을 사용하실 건가요? 이유와 함께 적어주세요!

- 커서 페이지네이션
- → offset방식과 비교하면 속도가 빠르다.
- → 데이터 누락의 위험이 적다.
</aside>

참고로, 워크북에서는 커서 기반 페이지네이션을 사용할 예정이에요.

만약 여러분이 오프셋 페이지네이션이 적합하다고 생각하셨다면, 오프셋 페이지네이션으로 진행하셔도 괜찮습니다. 굳이 워크북의 내용대로 생각을 바꾸실 필요는 없어요.

이렇게 왜 이걸 선택하게 되었는지 생각하면 조금 더 코드를 명확하게 짤 수 있어서 저는 한 번씩 생각해 보는 편이에요.

이제 본격적으로 API를 만들어보도록 합시다! 모든 내용을 아주 자세하게 설명하지는 않을거에요.

이번 주차에도 여러분들이 직접 만든 DB로 만드셔야 합니다! 코드는 제가 작성한 것과 당연히 달라질 수 있습니다. 제가 설계한 DB와 여러분들이 설계한 DB는 다를테니까요! 참고해주세요!

### 👉 목록 API에 대해 생각해보기

그러면, 우리는 만들기 전 생각을 해 봐야 할텐데, 이 화면에서 필요한 것들은 무엇일까요? 먼저 필요한 것들을 정리한다면 조금 더 깔끔하고 편하게 작성할 수 있겠죠.

![Untitled](Chapter%206%20ORM%20%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20%EB%AA%A9%EB%A1%9D%20API%20%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EA%B8%B0/Untitled.png)

<aside>
📜 목록 조회 API를 만들기 위해 필요한 데이터는 무엇일까?

1. 닉네임
2. 별점
3. 리뷰 작성 날짜
4. 리뷰의 상세 내용
5. ~~사진~~
6. ~~사장님 답글~~
</aside>

저는 이렇게 생각했습니다. 5번과 6번의 경우는 이번엔 제외하고 추후에 다뤄보도록 하겠습니다.

이러한 데이터를 불러올 때, 우리는 SQL을 사용해야겠죠. SQL문을 만들 때 어떤 것이 필요할 지 생각해보고, 그 후에 ORM으로 옮겨보면 좋을 것 같습니다.

또, 페이지네이션 방법도 위에서 생각했었죠?

어느 정도 생각이 정리 되었다면, 이제 만들어 봅시다.

아래 코드는 완성되어 있지만, 실제로는 각 함수들의 입력과 출력을 먼저 간단히 정의하면서 더미 값들을 채워두고 그 안의 내용을 구현하는 편입니다. (뼈대를 먼저 만든 후 내부 구현!)

```jsx
// 예시
export const getReview = async (storeId, query) => {
    return previewReviewResponseDTO(await getPreviewReview(reviewId, size, storeId));
}

export const previewReviewResponseDTO = (data) => {
    return {"reviewData": null, "cursorId": null};
}
```

물론 이것이 정답은 아닙니다. 여러분들은 여러분들의 편한 방식으로 진행해주세요. 😉

### 👉 API 만들기

우선 페이지네이션이 적용되지 않은 코드를 먼저 짜고, 그 다음에 페이지네이션을 적용해보도록 할게요!

Entity는 이미 다 짜두었다고 가정해서 생략하고, Controller, Servic, Repository, DTO에 집중해서 보여드릴게요. (`import`는 생략) 여러분들이 한 번 직접 API를 먼저 만들어 본 후 아래 코드를 보며 생각해보시는 것도 좋을 것 같아요!

### 👉 Controller 구현하기

가게에 속한 모든 리뷰를 조회할 수 있는 API를 구현할 예정이므로, 아래와 같이 API URL을 설계하고 Controller를 구현해보도록 할게요.

```jsx
app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
```

`handleListStoreReviews` Controller에서는 URL(엔드포인트)를 통해 `storeId` 정보를 받아보도록 할게요. `req.params` 객체에 이 정보가 들어있습니다.

```jsx
export const handleListStoreReviews = async (req, res, next) => {
  const reviews = await listStoreReviews(
    req.params.storeId
  );
  res.status(StatusCodes.OK).json(reviews);
};
```

### 👉 Service 구현하기

`listStoreReviews` Service에서는 단순히 Repository를 호출하고, 이를 DTO로 변환해 반환하는 로직을 구현할 거예요.

```jsx
export const listStoreReviews = async (storeId) => {
  const reviews = await getAllStoreReviews(storeId);
  return responseFromReviews(reviews);
};
```

### 👉 Repository 구현하기

`getAllStoreReviews` Repository에서는 ORM을 이용해서 간단히 구현해볼게요. 리뷰 정보뿐만 아니라 가게 정보, 사용자 정보를 함께 포함해 내려주고 싶어서 `select` 옵션을 사용해 필요한 필드만 선택적으로 조회하도록 설정했습니다. 

```jsx
import { prisma } from "../db.config.js";

export const getAllStoreReviews = async (storeId) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: {
      id: true,
      content: true,
      storeId: true,
      userId: true,
      store: true,
      user: true,
    },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};
```

`id: {gt:cursor}`  부분은 페이지네이션을 하기 위한 코드라는 것을 쉽게 알 수 있겠죠? 뒤에서 더 자세히 봐봅시다! 

여기까지는 아주 쉽게 구현할 수 있을 거예요. 하지만 현재 구조에서는 `storeId`에 해당하는 모든 리뷰가 조회되어 응답으로 내려가는 문제가 있죠. 댓글이 10,000개가 달렸다면, 10,000개의 댓글이 모두 한 번에 조회되어 응답으로 내려가는 거예요.

```json
[
  {
    "id": 1,
    "store": { "id": 1234, "name": "너디너리 야채 가게" },
    "user": {
      "id": 23,
      "email": "test@example.com",
      "name": "엘빈",
      "gender": "남성",
      "birth": "2000-02-03T00:00:00.000Z",
      "address": "주소1",
      "detailAddress": "세부주소1",
      "phoneNumber": "010-1234-1234"
    },
    "content": "테스트 5"
  },
  {
    "id": 6,
    "store": { "id": 1234, "name": "너디너리 야채 가게" },
    "user": {
      "id": 23,
      "email": "test@example.com",
      "name": "엘빈",
      "gender": "남성",
      "birth": "2000-02-03T00:00:00.000Z",
      "address": "주소1",
      "detailAddress": "세부주소1",
      "phoneNumber": "010-1234-1234"
    },
    "content": "테스트 6"
  },
  {
    "id": 7,
    "store": { "id": 1234, "name": "너디너리 야채 가게" },
    "user": {
      "id": 23,
      "email": "test@example.com",
      "name": "엘빈",
      "gender": "남성",
      "birth": "2000-02-03T00:00:00.000Z",
      "address": "주소1",
      "detailAddress": "세부주소1",
      "phoneNumber": "010-1234-1234"
    },
    "content": "테스트 7"
  },
  ...
]
```

바로 여기에서 페이지네이션의 도입이 필요하게 됩니다. DB에서 불필요한 데이터를 조회하는 부하와 성능 낭비를 줄이고, 꼭 필요한 데이터만 조회하는 식으로 변경하면 좋을 것 같지 않나요?

### 👉 Cursor 사용하기

API를 사용하는 쪽에서는 아래와 같이 호출해서, 데이터를 연속적으로 계속 읽어갈 수 있으면 좋을 것 같아요.

- `/api/v1/stores/:storeId/reviews` 조회 → 5개 항목 반환
- `/api/v1/stores/:storeId/reviews?cursor=5` 조회 → 5개 항목 반환
- `/api/v1/stores/:storeId/reviews?cursor=10` 조회 → 1~5개 항목 반환
- 더 조회할 데이터가 없다면 알아서 멈추기

이렇게 `?cursor=...` 로 데이터를 전달하는 것을 Query Param이라고 하는데요, Express에서는 아래와 같이 Query Param들을 조회하여 사용할 수 있습니다.

```jsx
export const handleListStoreReviews = async (req, res, next) => {
  const reviews = await listStoreReviews(
    parseInt(req.params.storeId),
    typeof req.query.cursor === "string" ? parseInt(req.query.cursor) : 0
  );
  res.status(StatusCodes.OK).success(reviews);
};
```

혹시나 값이 없는 경우, `0` 으로라도 설정될 수 있도록 값을 추가해주었습니다.

이제 이 `cursor` 값을 `listStoreReviews` 함수와 `getAllStoreReviews` 함수에게도 넘겨보겠습니다.

```jsx
import { prisma } from "../db.config.js";

export const getAllStoreReviews = async (storeId, cursor) => {
  const reviews = await prisma.userStoreReview.findMany({
    select: { id: true, content: true, store: true, user: true },
    where: { storeId: storeId, id: { gt: cursor } },
    orderBy: { id: "asc" },
    take: 5,
  });

  return reviews;
};
```

Repository는 크게 2가지가 변경되었습니다.

1. `id` 를 이용해서, `cursor` 값보다 더 큰 `id`를 가진 리뷰들만 조회합니다.
2. `take` 옵션을 이용해서 최대 조회 가능한 개수를 제한합니다. (LIMIT 절을 설정하는 것으로, 저는 5개로 설정했어요)

아직 하나 부족한 부분이 있다면, API를 사용할 때 이 `cursor` 정보를 어떻게 판단하느냐일 것 같습니다.

응답으로 내려가는 리뷰들 가운데 가장 마지막 리뷰의 `id`를 다음 요청의 `cursor` 값으로 사용할 수 있지만, 이런 규칙을 매번 설명하고 구현하기는 번거로울 것 같습니다.

마지막 퍼즐은 바로 DTO에서 채워보도록 하겠습니다.

```jsx
export const responseFromReviews = (reviews) => {
  return {
    data: reviews,
    pagination: {
      cursor: reviews.length ? reviews[reviews.length - 1].id : null,
    },
  };
};
```

Express에서 리뷰들의 가장 마지막 ID를 내려주고, 리뷰가 하나도 없다면 페이지네이션이 끝나 더 조회할 리뷰가 없는 상태이므로 `null` 을 내려주게 됩니다.

이렇게 하면 API를 사용할 때 `pagination > cursor` 값을 바로 다음 요청에 가져와 사용할 수 있기 때문에 더 명확하고, 덜 번거롭게 됩니다. (프론트엔드, 클라이언트 개발자 분들이 좋아할 거예요!)

이렇게 구현하고 postman이나 curl로 테스트를 한번 돌려보도록 합시다. 

![image.png](Chapter%206%20ORM%20%EC%82%AC%EC%9A%A9%ED%95%B4%EB%B3%B4%EA%B8%B0%20-%20%EB%AA%A9%EB%A1%9D%20API%20%EB%A7%8C%EB%93%A4%EC%96%B4%EB%B3%B4%EA%B8%B0/8c8671be-7bb7-4928-a485-73e22c784db3.png)

만약 이런식으로 `cursor` 를 생략한다면, 자동으로 0부터 조회가 시작되므로,  첫 페이지에서는 별도의 쿼리 파라미터 없이도 데이터를 받을 수 있습니다. 

테스트 결과가 예상한 대로 나온다면 성공입니다!