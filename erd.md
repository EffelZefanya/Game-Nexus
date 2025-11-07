# ERD

## 1. USERS Table

(Priority: CRUD Operations)

|Field|Type|Constraints|Description|
|---|---|---|---|
|`id`|INT|PRIMARY KEY, AUTO_INCREMENT|Unique user identifier|
|`username`|VARCHAR(50)|UNIQUE, NOT NULL|Login username|
|`email`|VARCHAR(100)|UNIQUE, NOT NULL|User email address|
|`password_hash`|VARCHAR(255)|NOT NULL|Hashed password|
|`full_name`|VARCHAR(100)|NOT NULL|User's full name|
|`phone_number`|VARCHAR(20)|NULLABLE|Contact number|
|`date_of_birth`|DATE|NULLABLE|Birth date for age verification|
|`profile_picture`|VARCHAR(255)|NULLABLE|Profile image URL|
|`role`|ENUM('user','admin')|DEFAULT 'user'|User role for permissions|
|`created_at`|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP|Registration date|
|`updated_at`|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP ON UPDATE|Last update timestamp|
|`deleted_at`|TIMESTAMP|DEFAULT NULL|Last delete timestamp and check if user is deleted or not|
|`last_login`|TIMESTAMP|NULLABLE|Last login datetime|

**Sample Data:**

## **2. CONTACT_SUBMISSIONS Table**

(Priority: Form Storage)

|Field|Type|Constraints|Description|
|---|---|---|---|
|`id`|INT|PRIMARY KEY, AUTO_INCREMENT|Unique submission ID|
|`user_id`|INT|FOREIGN KEY (users.id), NULLABLE|Link to user (if logged in)|
|`name`|VARCHAR(100)|NOT NULL|Submitter's name|
|`email`|VARCHAR(100)|NOT NULL|Submitter's email|
|`phone`|VARCHAR(20)|NULLABLE|Contact phone|
|`subject`|ENUM('general','support','partnership','complaint','other')|NOT NULL|Inquiry category|
|`message`|TEXT|NOT NULL|Detailed message|
|`submission_date`|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP|When form was submitted|
|`response`|TEXT|NULLABLE|Admin response to user|

## ### **PRODUCTS Table**

(Yet to be implemented)

|Field|Type|Constraints|Description|
|---|---|---|---|
|`id`|INT|PRIMARY KEY, AUTO_INCREMENT|Product ID|
|`name`|VARCHAR(255)|NOT NULL|Game/Product name|
|`description`|TEXT|NULLABLE|Product description|
|`price`|DECIMAL(10,2)|NOT NULL|Product price|
|`category`|ENUM('digital_game','merchandise','gaming_gear','gift_card')|NOT NULL|Product category|
|`platform`|ENUM('PC','PS5','XBOX','Switch','Multi')|NULLABLE|Gaming platform|
|`genre`|VARCHAR(50)|NULLABLE|Game genre|
|`image_url`|VARCHAR(255)|NULLABLE|Product image|
|`stock_quantity`|INT|DEFAULT 0|Available stock|
|`is_active`|BOOLEAN|DEFAULT TRUE|Product status|
|`release_date`|DATE|NULLABLE|Game release date|
|`created_at`|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP|Added to system|
|`updated_at`|TIMESTAMP|DEFAULT CURRENT_TIMESTAMP|Added to system|
|`deleted_at`|TIMESTAMP|DEFAULT NULL|Added to system|
