-- #region 🆕 ERD 내부 테이블 모두 생성 쿼리
create table address (
    id INT auto_increment primary key ,
    sido VARCHAR(20) not null ,
    gu VARCHAR(10) not null,
    dong VARCHAR(10) not null,
    full_address TEXT not null
);
create table user (
    id INT auto_increment primary key ,
    name VARCHAR(10) not null,
    email varchar(50) not null unique ,
    phone varchar(11) unique null default null,
    gender enum('MALE','FEMALE', 'NONE') not null,
    birth datetime not null,
    address_id INT not null,
    detail_address TEXT not null,
    platform enum('KAKAO','NAVER','APPLE','GOOGLE'),
    deleted_at timestamp null default null,
    created_at timestamp default current_timestamp,
    profile_photo_id INT null default null,

    FOREIGN KEY (address_id) REFERENCES address(id),
    FOREIGN KEY (profile_photo_id) REFERENCES address(id)
);

create table photo (
    id INT auto_increment primary key ,
    filename VARCHAR(50) not null,
    created_at timestamp default  current_timestamp,
    deleted_at timestamp null default null
);
create table food_type (
    id INT auto_increment primary key ,
    type_name VARCHAR(10) not null,
    restaurant_type_name VARCHAR(10) not null
);
create table favorite_food (
    id INT auto_increment primary key ,
    user_id INT not null,
    food_type_id INT NOT NULL,

    foreign key (user_id) references user(id),
    foreign key (food_type_id) references food_type(id)
);
create table terms (
    id INT auto_increment primary key ,
    required boolean not null,
    title VARCHAR(50) not null ,
    content TEXT not null
);
create table terms_agreement (
    id INT auto_increment primary key ,
    user_id INT not null,
    terms_id INT not null,

    foreign key (user_id) references user(id),
    foreign key (terms_id) references terms(id)
);
create table restaurant (
    id INT auto_increment primary key ,
    name VARCHAR(50) not null,
    food_type_id INT not null,
    address_id INT not null,
    detail_address TEXT not null,
    open_time DATETIME null default null,
    close_time DATETIME null default null,

    foreign key (food_type_id) references  food_type(id),
    foreign key (address_id) references  address(id)
);
create table mission (
    id INT auto_increment primary key ,
    restaurant_id INT not null ,
    created_at DATETIME default now(),
    end_at DATETIME not null ,
    goal INT not null,
    reward INT not null,
    foreign key (restaurant_id) references restaurant(id)
);
create table accepted_mission (
    id INT auto_increment primary key ,
    mission_id INT not null,
    user_id INT not null,
    verification_code VARCHAR(9) not null,
    accepted_at DATETIME not null default now(),
    completed_at DATETIME null default null,
    foreign key (mission_id) references mission(id),
    foreign key (user_id) references user(id)
);
create table reward (
    id INT auto_increment primary key ,
    user_id INT not null,
    reward INT not null default 0,
    foreign key (user_id) references user(id)
);
create table reward_history (
    id INT auto_increment primary key ,
    user_id INT not null,
    title VARCHAR(50) not null,
    description VARCHAR(70) null default null,
    occured_at DATETIME not null default now(),
    foreign key (user_id) references user(id)
);
create table reward_withdraw (
    id INT auto_increment primary key ,
    user_id INT not null,
    withdraw_reward INT not null,
    occured_at DATETIME not null default now(),
    foreign key (user_id) references user(id)
);
create table review (
    id INT auto_increment primary key ,
    restaurant_id INT not null,
    score FLOAT not null,
    content TEXT not null ,
    created_at DATETIME default now(),
    deleted_at DATETIME null default null,
    foreign key (restaurant_id) references restaurant(id)
);
create table review_answer (
    id INT auto_increment primary key ,
    review_id INT not null,
    answer TEXT not null ,
    created_at DATETIME default now(),
    foreign key (review_id) references review(id)
);
create table review_photo (
    id INT auto_increment primary key ,
    review_id INT not null ,
    photo_id INT not null ,
    foreign key (review_id) references review(id),
    foreign key (photo_id) references photo(id)
);
create table contact (
    id INT auto_increment primary key ,
    title VARCHAR(70) not null,
    content TEXT not null ,
    created_at DATETIME not null default now(),
    contact_type enum('GENERAL','ACCOUNT','REWARD','ETC') not null
);
create table contact_photo (
    id INT auto_increment primary key ,
    contact_id INT not null,
    photo_id INT not null,
    foreign key (contact_id) references contact(id),
    foreign key (photo_id) references photo(id)
);
create table contact_answer (
    id INT auto_increment primary key ,
    contact_id INT not null,
    answer TEXT not null,
    created_at DATETIME not null default now(),
    foreign key (contact_id) references contact(id)
);

create table accept_notification (
    id INT auto_increment primary key ,
    user_id INT not null ,
    type ENUM('NEW_EVENT','REVIEW_ANSWER','CONTACT_ANSWER')
);
create table notification (
    id INT auto_increment primary key ,
    title VARCHAR(50) not null ,
    content TEXT not null,
    created_at TIMESTAMP not null default CURRENT_TIMESTAMP
);

create table received_notification (
    id INT auto_increment primary key ,
    notification_id INT not null ,
    user_id INT not null,
    is_read boolean not null default false,
    foreign key (notification_id) references notification(id),
    foreign key (user_id) references user(id)
);
-- #endregion
-- #region 미션
-- -- 진행중인 미션
select accepted_mission.id, r.name, m.goal, m.reward 
from accepted_mission join mission m on m.id = accepted_mission.mission_id 
join restaurant r on r.id = restaurant_id 
where completed_at is null and user_id = <유저아이디> 
limit <갯수> offset <(페이지번호-1>)*갯수>;
-- -- 완료된 미션
select accepted_mission.id, r.name, m.goal, m.reward 
from accepted_mission join mission m on m.id = accepted_mission.mission_id 
join restaurant r on r.id = restaurant_id 
where completed_at is not null and user_id = <유저아이디> 
limit <갯수> offset <(페이지번호-1>)*갯수>;
-- #endregion
-- #region 리뷰 작성
insert into review(restaurant_id, score, content) 
values(<식당 ID>,<별점(0~5.0)>, '리뷰 내용');
-- #endregion
-- #region 홈 화면

-- -- 현재 선택된 지역에서 도전이 가능한 미션 목록
select name, restaurant_type_name, end_at, goal, reward 
from mission left join (select * from accepted_mission where user_id = <유저ID>) am 
on am.mission_id = mission.id 
join restaurant r on r.id = mission.restaurant_id 
join food_type ft on ft.id = food_type_id 
where accepted_at is null and address_id = <지역ID> 
limit <갯수> offset <(페이지번호-1>)*갯수>;

-- -- 미션 10개 중 몇개 달성했는지 표시
select count(*) count from accepted_mission 
join mission m on accepted_mission.mission_id = m.id 
join restaurant r on r.id = restaurant_id 
where address_id = <지역ID> and completed_at is not null and user_id = <유저ID>;

-- -- 잔여 포인트
select reward from reward where user_id = <유저ID>;
-- #endregion
-- #region 마이페이지
select name,email,phone,reward from user 
join reward r on r.user_id = user.id where user.id = <유저ID>;
-- #endregion