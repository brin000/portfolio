---
title: SQL 基础语法全解析：主键、外键与 SELECT 查询详解
date: 2024-12-05
summary: 系统梳理 SQL 基本概念与语法，详细解读主键与外键作用，结合代码示例讲解 SELECT 子句用法，助力快速掌握数据库检索核心能力。
---

### 主键（primary key）
- 一列（或几列），其值能够唯一标识表中每一行。
- 应该总是定义主键。
### 外键（FOREIGN KEY）
外键是数据完整性保障。
1. **确保数据完整性**：
- 禁止插入无效的关联数据（例如：不能为用户添加一个不存在的订阅类型）
2. **维护表关系**：
- 建立表之间的关联（例如：用户表和订单表的关系）
3. **支持级联操作**：
- 当主表数据更改时自动处理相关表数据（例如：删除用户时自动删除该用户的所有订单）
### SQL（Structured Query Language）
- SQL 语句是由简单的英语单词构成的。这些单词称为关键字，每个 SQL 语句都是由一个或多个关键字构成的。
### SELECT 子句

| 子句       | 说明        | 是否必须使用      |
| -------- | --------- | ----------- |
| SELECT   | 要返回的列或表达式 | 是           |
| FROM     | 从中检索数据的表  | 仅在从表选择数据时使用 |
| WHERE    | 行级过滤      | 否           |
| GROUP BY | 分组说明      | 仅在按组计算聚集时使用 |
| HAVING   | 组织过滤      | 否           |
| ORDER BY | 输出排序顺序    | 否           |
#### 检索数据
```sql
SELECT prod_name FROM Products;
```
- 基础用法
	- 上述语句利用 SELECT 语句从 Products 表中检索一个名为 prod_name的列。所需的列名写在 SELECT 关键字之后，FROM 关键字指出从哪个表中检索数据。
	- 一条简单 SELECT 语句将返回表中的所有行。数据没有==过滤==，也没有==排序==。
	- 多条 SQL 语句必须以分号（ ；）分隔。

- 检索多个列
```sql
SELECT prod_id, prod_name, prod_price FROM Products;
```

- 检索所有列
	- 如果给定一个通配符（`*`），则返回表中所有列。列的顺序一般是表中出 现的物理顺序，但并不总是如此。
```sql
SELECT * FROM Products;
```

- 检索不同的值
	- 使用 ==DISTINCT== 关键字，顾名思义，它指示数据库只返回不同的值。
	- SELECT DISTINCT vend_id 告诉 DBMS只返回不同（具有唯一性）的 vend_id 行。
```sql
SELECT DISTINCT vend_id FROM Products;
```

- 限制结果
	- 各种数据库中的这一SQL实现并不相同。
	- 在 PostgreSQL 中，如果你想返回前 N 行，可以这样做
		- SELECT * FROM your_table LIMIT N;
	- 使用 OFFSET 跳过行
		- SELECT * FROM your_table LIMIT N OFFSET M;  
			- N 是返回的行数，M 是要跳过的行数

#### 排序检索语句
在数据库中，如果不明确指定排序方式，检索到的数据顺序可能会受到后续更新或删除的影响，导致结果混乱。因此，为了确保数据的可理解性和可靠性，最好在查询时自行设定排序规则。

- ORDER BY 子句
	- 在指定一条 ORDER BY 子句时，应该保证它是 SELECT 语句中最后一条子句。如果它不是最后的子句，将会出错。
	- 对 prod_name 列以字母顺序排序
```sql
SELECT prod_name FROM Products ORDER BY prod_name;
```

- 按多个列排序
	- 按多个列排序时，排序的顺序完全按==规定==进行。
	- 下面的代码检索 3 个列，并按其中两个列对结果进行排序——首先按价格，然后按名称排序。
	- 仅在多个行具有`相同`的 prod_price 值时才对产品按 prod_name 进行排序。如果 prod_price 列中所有的值都是唯一的，则不会按 prod_name 排序。
```sql
SELECT prod_id, prod_price, prod_name FROM Products ORDER BY prod_price, prod_name;
```

- 按列位置排序
	- ORDER BY 还支持按相对列位置进行排序。
```sql
SELECT prod_id, prod_price, prod_name FROM Products ORDER BY 2, 3;
```


- 指定排序方向
	- 升序是默认的（如果既不指定 ASC 也不指定DESC，则假定为 ASC）
	- 进行降序排序，必须指定 ==DESC== 关键字
	- DESC 关键字只应用到直接位于其前面的列名。
	- 下面的例子以价格降序来排序产品（最贵的排在最前面）
```sql
SELECT prod_id, prod_price, prod_name FROM Products 
ORDER BY prod_price DESC;
```

```sql
SELECT prod_id, prod_price, prod_name FROM Products
ORDER BY prod_price DESC, prod_name;
```

#### 过滤数据
数据库表包含大量数据，但通常只需提取特定子集。通过设置搜索条件==（search criteria）==或过滤条件==（filter condition）==，可以精确筛选所需记录，优化查询性能和响应速度。

- 使用 WHERE 子句
	- 在同时使用ORDER BY和WHERE子句时，应该让ORDER BY位于 WHERE之后，否则将会产生错误
	- 这条语句从 products 表中检索两个列，但不返回所有行，只返回 prod_price 值为3.49 的行
```sql
SELECT prod_name, prod_price FROM Products WHERE prod_price = 3.49;
```

- WHERE 子句操作符
	- ![[Pasted image 20250121210934.png]]

- 组合WHERE子句
	- SQL允许给出多个WHERE子句。这些子句有两 种使用方式，即以==AND子句==或==OR子句==的方式使用。
	- 此SQL语句检索由任一个指定供应商制造的所有产品的产品名和价格。 OR 操作符告诉DBMS匹配任一条件而不是同时匹配两个条件。如果 这里使用的是AND操作符，则没有数据返回
```sql
SELECT prod_id, prod_price, prod_name FROM Products WHERE vend_id = 'DLL01' OR vend_id = 'BRS01';
```

- 求值顺序
	- 在 SQL 中，逻辑运算符 `AND` 和 `OR` 的优先级会影响查询的结果。默认情况下，`AND` 的优先级高于 `OR`，这意味着在没有括号的情况下，SQL 会首先评估 `AND` 条件，然后再评估 `OR` 条件。
	- 任何时候使用具有AND和OR操作符的WHERE子句，都应该使用圆括号明确地分组操作符。
	- 通过使用圆括号将前两个条件括起来，SQL 会优先处理括号内的 `OR` 条件。这确保了查询选择的是由供应商DLL01或BRS01制造且价格在10美元及以上的产品，正是我们期望的结果。
```sql
SELECT prod_name, prod_price FROM Products WHERE (vend_id = 'DLL01' OR vend_id = 'BRS01') AND prod_price >= 10;
```


- IN操作符
	- `IN 操作符`用来指定条件范围，范围中的每个条件都可以进行匹配。IN取一组由逗号分隔、括在圆括号中的合法值。
	- 此SELECT语句检索由供应商DLL01和BRS01制造的所有产品。IN操作符后跟由逗号分隔的合法值，这些值*必须括在圆括号中*。
```sql
SELECT prod_name, prod_price FROM Products WHERE vend_id IN ('DLL01','BRS01') ORDER BY prod_name;
```
- IN操作符完成了与OR相同的功能，
```sql
SELECT prod_name, prod_price FROM Products WHERE vend_id = 'DLL01' OR vend_id = 'BRS01' ORDER BY prod_name;
```
- 为什么要使用IN操作符？
	- 在有很多合法选项时，IN操作符的语法更清楚，更直观。
	- 在与其他AND和OR操作符组合使用IN时，求值顺序更容易管理。
	- IN操作符一般比一组OR操作符执行得更快。
	- IN的最大优点是可以包含其他SELECT语句，能够更动态地建立WHERE子句。


- NOT 操作符
	- WHERE子句中的NOT操作符有且只有一个功能，那就是否定其后所跟的 任何条件。
```sql
SELECT prod_name FROM Products WHERE NOT vend_id = 'DLL01' ORDER BY prod_name;
```

#### 用通配符进行过滤 
利用通配符（wildcard），可以创建比较特定数据的搜索模式。
通配符本身实际上是SQL的==WHERE子句==中有特殊含义的字符，SQL支持几种通配符。为在搜索子句中使用通配符，必须使用==LIKE操作符==。LIKE指示DBMS，后跟的搜索模式利用通配符匹配而不是简单的相等匹配进行比较。

- 百分号`（%）`通配符
	- 在搜索串中，%表示任何字符出现任意次数。
	- 某些 DBMS 通过在字段后附加空格来填充内容，这可能导致 SQL 查询受影响，如 `LIKE 'F%y'` 无法匹配尾随空格的值。解决方案是使用 `LIKE 'F%y%'`，或使用函数去掉空格。
	- `LIKE '%'` 也不会匹配 NULL 值。
	- 为了找出所有以词Fish起头的产品，可写以下的SELECT语句：
```sql
SELECT prod_id, prod_name FROM Products WHERE prod_name LIKE 'Fish%';
```


- 下划线`(_)`通配符
	- 下划线的用途与%一样，但它只匹配 单个字符，而不是多个字符。
```sql
SELECT prod_id, prod_name FROM Products WHERE prod_name LIKE '__ inch teddy bear';
```

- 方括号`（[ ]）`通配符
	- 方括号（[]）通配符用来指定一个字符集（集合），它必须匹配指定位置（通配符的位置）的一个字符。
	- 大多数DBMS都不支持

- 使用通配符的技巧
	- 通配符搜索一般比前面讨论的其他搜索要耗费更长的处理时间。
	- 不要==过度==使用通配符。如果其他操作符能达到相同的目的，应该使用其他操作符。
	- 在确实需要使用通配符时，也尽量不要把它们用在搜索模式的开始处。把通配符置于开始处，搜索起来是最慢的。
	- 仔细注意通配符的位置。如果放错地方，可能不会返回想要的数据。


#### 创建计算字段
我们需要从数据库中直接检索经过转换、计算或格式化的数据，而非在客户端应用程序中重新处理原始数据。
- 计算字段并不实际存在于数据库表中。计算字段是运行时在 SELECT 语句内创建的。

- 拼接字段
	- concatenate 将值联结到一起（将一个值附加到另一个值）构成单个值
	- PostgreSQL提供了几种拼接字符串的方法：
		1. 使用 || 操作符：
		2. 使用 CONCAT() 函数
		3. 使用 CONCAT_WS() 函数（带分隔符）
			- CONCAT_WS 的第一个参数是分隔符，后面的参数是要拼接的字段。
	- || 是PostgreSQL标准语法
	- 如果任何一个字段为NULL，使用 || 运算符会导致整个结果为NULL
	- CONCAT() 和 CONCAT_WS() 会自动将NULL转换为空字符串
```sql
SELECT RTRIM(vend_name) || ' (' || RTRIM(vend_country) || ')' FROM Vendors ORDER BY vend_name;
```

- 使用别名
	- 别名（alias）是一个字段或值的 替换名。别名用==AS关键字==赋予。
	- 别名常用于简化列名，特别是在列名包含不合法字符或含义不清时，以提高可读性和避免客户端应用中的问题。
```sql
SELECT RTRIM(vend_name) + ' (' + RTRIM(vend_country) + ')' AS vend_title FROM Vendors ORDER BY vend_name;
```

- 执行算术计算
```sql
SELECT prod_id, quantity, item_price, quantity*item_price AS expanded_price FROM OrderItems WHERE order_num = 20008;
```
![[Pasted image 20250121223540.png]]
SELECT 语句不仅用于从表中检索数据，还可以用来测试和验证表达式。例如：
- `SELECT 3 * 2;` 返回 `6`
- `SELECT TRIM(' abc ');` 返回 `abc`
- `SELECT CURDATE();` 返回当前日期和时间
因此，你可以灵活使用 SELECT 语句进行各种计算和函数检验
#### 使用函数处理数据
函数一般是在数据上执行的，为数据的转换和处理提供了方便。
![[Pasted image 20250121223850.png]]
- SQL 函数不区分大小写，但为提高可读性，建议保持一致的命名风格。

- 文本处理函数
	- UPPER()

- 日期和时间处理函数
	- **`EXTRACT(field FROM source)`**: 从日期或时间中提取特定字段。
	SELECT EXTRACT(YEAR FROM order_date) AS year FROM Orders;
	- **`DATE_PART(field, source)`**: 类似于 `EXTRACT`，用于提取日期的部分。
	- **`CURRENT_DATE`**:
	    - 返回当前的日期，类型为 `date`。
	    - 示例返回：`2023-01-21`
	- **`NOW()`**:
	    - 返回当前的日期和时间，类型为 `timestamp`。
	    - 示例返回：`2023-01-21 14:30:00`
```sql
SELECT DATE_PART('month', order_date) AS month FROM Orders;
```

- 数值处理函数
	- ![[Pasted image 20250121224354.png]]

#### 汇总数据
- 聚集函数（aggregate function）
	- AVG()   返回某列的平均值
	- COUNT() 返回某列的行数
	- MAX()   返回某列的最大值
	- MIN()   返回某列的最小值
	- SUM()   返回某列值之和
```sql
SELECT AVG(prod_price) AS avg_price FROM Products;
```

- 聚集不同值
	- 对所有行执行计算，指定ALL参数或不指定参数（因为ALL是默认行为） 
	- 只包含不同的值，指定DISTINCT参数
	- 使用了DISTINCT参数，因此平均值只考 虑各个不同的价格：
```sql
SELECT AVG(DISTINCT prod_price) AS avg_price FROM Products WHERE vend_id = 'DLL01';
```
- DISTINCT
	- 在 SQL 中，`DISTINCT` 只能用于 `COUNT(column_name)`，不能用于 `COUNT(*)`，且需指定列名，用于统计不同值的数量。
	- 将 `DISTINCT` 用于 `MIN()` 和 `MAX()` 没有意义，因为最小值和最大值不受重复值影响。

- 组合聚集函数
```sql
SELECT COUNT(*) AS num_items, MIN(prod_price) AS price_min, MAX(prod_price) AS price_max, AVG(prod_price) AS price_avg FROM Products;
```

#### 分组数据
当需要对某个字段的值进行汇总时，使用 `GROUP BY` 可以将==相同字段==值的记录分为一组，并对每组进行计算。
分组是使用SELECT语句的GROUP BY子句建立的。
```sql
SELECT vend_id, COUNT(*) AS num_prods FROM Products GROUP BY vend_id;
```
- GROUP BY 子句指示DBMS按vend_id排序并分组数据。这就会对每个vend_id而不是整个表计算num_prods一次。

1. **多列分组**：
    - `GROUP BY` 子句可以包含多个列，实现嵌套分组，允许对数据进行更细致的分组。
2. **汇总计算**：
    - 数据将在最后指定的分组上进行汇总，所有指定的列一起计算，不能从个别列中提取数据。
3. **列的要求**：
    - `GROUP BY` 中列出的每一列必须是检索列或有效的表达式，不能是聚集函数。
    - 如果在 `SELECT` 中使用表达式，必须在 `GROUP BY` 中指定相同的表达式，且不能使用别名。
4. **数据类型限制**：
    - 大多数 SQL 实现不允许 `GROUP BY` 列使用可变长度的数据类型（如文本或备注型字段）。
5. **SELECT 列的限制**：
    - 除聚集计算外，`SELECT` 中的每一列都必须在 `GROUP BY` 子句中列出。
6. **NULL 值处理**：
    - 如果分组列中包含 NULL 值，NULL 将作为一个分组返回，所有 NULL 值将被视为一组。
7. **位置要求**：
    - `GROUP BY` 子句必须位于 `WHERE` 子句之后，`ORDER BY` 子句之前。


- 过滤分组`HAVING`
	- SQL允许过滤分组，规定包括哪些分组，排除哪些分组。
	- 所有类型的WHERE子句都可以用HAVING来替代。唯一的差别是，WHERE 过滤`行`，而HAVING过滤`分组`。
	- 这条SELECT语句的前三行类似于上面的语句。最后一行增加了HAVING 子句，它过滤`COUNT(*) >= 2`（两个以上订单）的那些分组。
	- WHERE 子句在这里不起作用，因为过滤是基于分组聚集值， 而不是特定行的值。
	- WHERE在`数据分组前`进行过滤，HAVING在`数据分组后`进行过滤。
```SQL
SELECT cust_id, COUNT(*) AS orders FROM Orders GROUP BY cust_id HAVING COUNT(*) >= 2;
```

- 分组和排序
一般在使用GROUP BY 子句时，应该也给出ORDER BY子句。这是保证数据正确排序的唯一方法。千万不要仅依赖GROUP BY排序数据。
按订购物品的数目排序输出:
```sql
SELECT order_num, COUNT(*) AS items FROM OrderItems GROUP BY order_num HAVING COUNT(*) >= 3 ORDER BY items, order_num;
```

#### 使用子查询(subquery)
- 可以把一条 SELECT 语句返回的结果用于另一条SELECT语句的WHERE子句。
- 子查询在主查询内部
- 子查询可以返回单个值、一列值或一个结果集
- 子查询可以用在：
    - WHERE子句（作为过滤条件）
    - SELECT子句（作为计算列）
    - FROM子句（作为数据源）
    - HAVING子句（分组后过滤）
```sql
SELECT cust_name, cust_contact FROM Customers WHERE cust_id IN (SELECT cust_id FROM Orders WHERE order_num IN (SELECT order_num FROM OrderItems WHERE prod_id = 'RGAN01'));
```

- 作为计算字段的子查询必须返回单个值
- orders 是一个计算字段，它是由圆括号中的 子查询建立的。该子查询对检索出的`每个`顾客执行一次。在此例中，该子查询执行了5次，因为检索出了5个顾客。
- 子查询中的WHERE子句与前面使用的WHERE子句稍有不同，因为它使用了`完全限定列名`_(用一个句点分隔表名和列名，在有可能混淆列名时必须使用这种语法)_，而不只是列名（cust_id）。它指定表名和列名 （Orders.cust_id和Customers.cust_id）。
```sql
SELECT cust_name, cust_state, (SELECT COUNT(*) FROM Orders WHERE Orders.cust_id = Customers.cust_id) AS orders FROM Customers ORDER BY cust_name;
```

#### 联结表
SQL的联结（JOIN）功能是其最强大的特性之一，能够在数据查询执行中将多个表连接起来，从而实现复杂的数据检索和分析。

- 创建联结
	- 创建联结非常简单，指定要联结的所有表以及关联它们的方式即可。
```sql
SELECT vend_name, prod_name, prod_price FROM Vendors, Products WHERE Vendors.vend_id = Products.vend_id;
```

- 要保证所有联结都有WHERE子句，否则DBMS将返回比想要的数据多 得多的数据。
	在SQL查询中，使用`WHERE`子句建立联结关系是至关重要的。它用于指定联结条件，确保只有满足特定条件的行被选中，从而避免生成笛卡儿积（Cartesian Product）。笛卡儿积会将两个表中的每一行进行配对，导致结果集的行数为两个表行数的乘积，通常产生大量无用数据。因此，`WHERE`子句能够有效过滤结果，提高查询的效率和准确性。


- 内联结
	`INNER JOIN`会比较两个表中的每一条记录，只有当连接条件满足时，才会将这些记录合并为一条新的结果行。
```sql
SELECT vend_name, prod_name, prod_price FROM Vendors INNER JOIN Products ON Vendors.vend_id = Products.vend_id;
```
此语句中的SELECT与前面的SELECT语句相同，但FROM子句不同。这里，两个表之间的关系是以INNER JOIN指定的部分FROM子句。在使用这种语法时，联结条件用特定的ON子句而不是WHERE子句给出。传递给ON的实际条件与传递给WHERE的相同。

- 联结多个表
	- 首先列出所有表，然后定义表之间的关系。
```sql
SELECT prod_name, vend_name, prod_price, quantity FROM OrderItems, Products, Vendors WHERE Products.vend_id = Vendors.vend_id AND OrderItems.prod_id = Products.prod_id AND order_num = 20007;
```

*联结的表越多，性 能下降越厉害。*

#### 创建高级联结
- 自联结
```sql
SELECT cust_id, cust_name, cust_contact FROM Customers WHERE cust_name = (SELECT cust_name FROM Customers WHERE cust_contact = 'Jim Jones');
```
- 使用联结的相同查询：
```sql
SELECT c1.cust_id, c1.cust_name, c1.cust_contact FROM Customers AS c1, Customers AS c2 WHERE c1.cust_name = c2.cust_name AND c2.cust_contact = 'Jim Jones';
```
*为了提高性能，通常建议使用连接（JOIN）替代子查询，因为连接操作可以在一次扫描中处理多个表的数据，避免重复计算，从而提高效率。*`

- 自然联结
	- 自然连接会自动识别和匹配两个表中`相同名称的列`，并将这些列合并到结果集中。与标准的联接不同，自然连接会消除重复的列，只保留一份相同列的数据。这使得结果集更加简洁和易于理解。
	- 自然联结要求你只能选择那些唯一的列，一般通过对一个表使用通配符 （`SELECT *`），而对其他表的列使用明确的子集来完成。下面举一个例子：
```sql
SELECT C.*, O.order_num, O.order_date, OI.prod_id, OI.quantity, OI.item_price FROM Customers AS C, Orders AS O, OrderItems AS OI WHERE C.cust_id = O.cust_id AND OI.order_num = O.order_num AND prod_id = 'RGAN01';
```
通配符只对第一个表使用。所有其他列明确列出，所以没有重复的列被检索出来。

- 内连接
	- 内连接只返回两个表中满足连接条件的行。只有当两个表中的连接字段相等时，才会返回结果。
	- 通常用于需要精确匹配信息的查询，例如获取所有有订单的客户。

- 外联结
	- 外连接不仅返回满足连接条件的行，还包括至少一个表中的非匹配行。外连接可以分为左外连接、右外连接和全外连接。
	- 要检索所有的顾客名单，不论他们有没有下过订单。查看所有顾客的订单情况:
```sql
SELECT Customers.cust_id, Orders.order_num FROM Customers LEFT OUTER JOIN Orders ON Customers.cust_id = Orders.cust_id;
```
使用LEFT OUTER JOIN 从FROM子句左边的表（Customers 表）中`选择所有行`。确保Customers表中的所有记录都被包含在查询结果中。

- 全外联结（full outer join）
	- 它检索两个表中的所有行并关联那些可以关联的行。与左外联结或右外联结包含一个表的不关联的行不同，全外联结包含两个表的不关联的行。
```sql
SELECT Customers.cust_id, Orders.order_num FROM Customers FULL OUTER JOIN Orders ON Customers.cust_id = Orders.cust_id;
```

- 使用带聚集函数的联结
	- 要检索所有顾客及每个顾客所下的订单数
```sql
SELECT Customers.cust_id, COUNT(Orders.order_num) AS num_ord FROM Customers INNER JOIN Orders ON Customers.cust_id = Orders.cust_id GROUP BY Customers.cust_id;
```
这条SELECT语句使用INNER JOIN将Customers和Orders表互相关联。 GROUP BY 子句按顾客分组数据，因此，函数调用COUNT(Orders.order_num) 对每个顾客的订单计数，将它作为num_ord返回。

SQL联结的关键注意事项：
1. 联结类型使用
	- 优先使用内联结(INNER JOIN)
	- 必要时才用外联结(OUTER JOIN)
2. 联结条件
	- 必须明确指定联结条件
	- 避免无条件联结(防止笛卡儿积)
3. 多表联结
	- 分步测试每个联结
	- 从简单到复杂逐步验证


#### 组合查询(UNION)
多数SQL查询通常只包含单条SELECT语句来从一个或多个表中返回数据，但SQL也允许执行多个查询，并将结果合并为一个结果集，这种组合查询称为并（`UNION`）或复合查询（compound query）

- 创建组合查询: 使用UNION很简单，所要做的只是给出每条SELECT语句，在各条语句之间放上关键字UNION。
```sql
SELECT cust_name, cust_contact, cust_email FROM Customers WHERE cust_state IN ('IL','IN','MI');
```
```sql
SELECT cust_name, cust_contact, cust_email FROM Customers WHERE cust_name = 'Fun4All';
```
第一条SELECT把Illinois、Indiana、Michigan等州的缩写传递给 IN 子句， 检索出这些州的所有行。第二条 SELECT 利用简单的相等测试找出所有 Fun4All。你会发现有一条记录出现在两次结果里，因为它满足两次的 条件。
组合这两条语句：
```sql
SELECT cust_name, cust_contact, cust_email FROM Customers WHERE cust_state IN ('IL','IN','MI') UNION SELECT cust_name, cust_contact, cust_email FROM Customers WHERE cust_name = 'Fun4All';
```
UNION 指示DBMS执行这两条SELECT语句，并把输出组合成一个查询结果集。
- UNION 必须由两条或两条以上的SELECT语句组成，语句之间用关键字 UNION 分隔（因此，如果组合四条SELECT语句，将要使用三个UNION关键字）。 
- UNION 中的每个查询必须包含相同的列、表达式或聚集函数（不过，各个列不需要以相同的次序列出）。 
- 列数据类型必须兼容：类型不必完全相同，但必须是DBMS可以隐含转换的类型（例如，不同的数值类型或不同的日期类型）
- UNION 从查询结果集中自动去除了重复的行。如果想返回所有的匹配行，可使用`UNION ALL`而不是UNION。

#### 插入数据
`INSERT`用来将行插入（或添加）到数据库表。插入有几种方式：
- 插入完整的行
```sql
INSERT INTO Customers VALUES(1000000006, 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA', NULL, NULL);
```
- 这个例子将一个新顾客插入到Customers表中。存储到表中每一列的数据在`VALUES子句`中给出，必须给每一列提供一个值。如果某列没有值， 如上面的cust_contact和cust_email列，则应该使用NULL值（假定表允许对该列指定空值）。各列必须以它们在表定义中出现的`次序`填充。
	- 虽然这种语法很简单，但并不安全，应该尽量避免使用。因为它高度依赖于表中列的`定义次序`，还依赖于其容易获得的次序信息。
- 编写INSERT语句的更安全（不过更烦琐）的方法如下：
	- 即使表的结构改变，这条 INSERT语句仍然能正确工作。
```sql
INSERT INTO Customers(cust_id, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country, cust_contact, cust_email) VALUES(1000000006, 'Toy Land', '123 Any Street', 'New York', 'NY', '11111', 'USA', NULL, NULL);
```
*不要使用没有明确给出列的INSERT语句。*

- 插入行的一部分
	- 使用INSERT的推荐方法是明确给出表的列名，这样可以省略某些列，从而只为特定列提供值。省略的列必须满足以下某个条件。 
		- 该列定义为允许NULL值（无值或空值）。 
		- 在表定义中给出默认值。这表示如果不给出值，将使用默认值。
- 插入某些查询的结果
	- INSERT一般用来给表插入具有指定列值的行。INSERT还存在另一种形式，可以利用它将SELECT语句的结果插入表中，这就是所谓的`INSERT SELECT`。顾名思义，它是由一条INSERT语句和一条SELECT语句组成的。
	- 如果CustNew表确实有数据，则所有数据将被插入到Customers。
```sql
INSERT INTO Customers(cust_id, cust_contact, cust_email, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country) SELECT cust_id, cust_contact, cust_email, cust_name, cust_address, cust_city, cust_state, cust_zip, cust_country FROM CustNew;
```

- 从一个表复制到另一个表
	- CREATE SELECT 将数据复制到一个新表
```sql
CREATE TABLE CustCopy AS SELECT * FROM Customers;

// 若是使用SQL Server，可以这么写
SELECT * INTO CustCopy FROM Customers;
```
