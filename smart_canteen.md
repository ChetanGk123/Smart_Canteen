Smart Canteen Updates:

For our internal use only works only on Super User Login:

1. API to operate on Canteen Data
    Note: Register only one Canteen into the system
    a. To register new Canteen
        post: /api/v1/canteen_ops/insert
        payload: {
            "canteen_name":"canteen_name",
            "address":"address",
            "registered_on":"27-01-2023",
            "contact_person":"contacat_person",
            "contact_number":"contacta_sumber",
            "email": "emaisla",
            "gst_no":"gst_no" //non-mandatory
        }
    
    b. To update the canteen
        post: /api/v1/canteen_ops/update
        payload: {
            "canteen_id: 1
            "canteen_name":"canteen_name",
            "address":"address",
            "registered_on":"27-01-2023",
            "contact_person":"contacat_person",
            "contact_number":"contacta_sumber",
            "email": "emaisla",
            "gst_no":"gst_no" //non-mandatory
        }

2. To fetch registered canteen
    get: /api/v1/table_data/CANTEEN

3. To fetch the role
    get: /api/v1/table_data/ROLE

4. API to operate on Counter Data //Done
    a. To register a new Counter
        post: /api/v1/counter_ops/insert
        payload: {
            "school_name": "new school name",
            "counter_name": "new counter name",
            "counter_address": "new counter address",
            "contact_person": "new_newperason",
            "contact_number": "new_newphasaaphph",
            "email": "new_newraamaaeailss@gmail.com",
            "role_id": 1
        }

    b. To update the counter data //Done
        post: /api/v1/counter_ops/update
        payload: {
            "school_name": "new school name",
            "counter_name": "new counter name",
            "counter_address": "new counter address",
            "contact_person": "new_newperason",
            "contact_number": "new_newphasaaphph",
            "email": "new_newraamaaeailss@gmail.com",
            "role_id": 1,
            "counter_id":1
        }

5. To fetch the counters //Done
    get: /api/v1/table_data/COUNTER

6. To fetch specific counter //Done
    get: /api/v1/specific_data/COUNTER/counter_id

7. Assign license to a counter //Done
    post: /api/v1/license_ops/insert
    payload: {
        "counter_id":1,
        "license_start_date":"29-01-2023",
        "no_of_days":365
    }

8. To fetch the assigned license to a specific counter //Done
    get: /api/v1/specific_data/COUNTER_LICENSE/counter_id

9. To fetch all the licenses across the system
    get: /api/v1/table_data/COUNTER_LICENSE
    

To be implemented on GUI:

10. To login
    post: /api/v1/user_login
    payload: {
        "username":"counter1@canteen.com",
        "password":"counter1@canteen.com"
    }

11. To fetch Member type
    get: /api/v1/table_data/MEMBER_TYPE

12. Member Operations: To operate on Member Data
    a. To insert new Member:
        post: /api/v1/member_ops/insert
        payload: {
        "counter_id": 1,
        "member_data":[
            {
                "card_number":"74475537390123",
                "full_name" :"full_name",
                "gender" :"gender",
                "phone_number" :"newphone_number", //non-madatory
                "parents_ph" :"newparents_ph",
                "dob" :"30-01-1998",
                "email" :"email@gmail.com", //non-madatory
                "class_name" :"new_class_name", //non-madatory
                "division_name" :"new_division_name", //non-madatory
                "hostel_details" :"new_hostel_details", //non-madatory
                "member_type_id" :1,
                "address" :"new address", //non-madatory
                "opening_balance" :0
            },
            {
                "card_number":"74475537390123",
                "full_name" :"1full_name",
                "gender" :"1gender",
                "phone_number" :"newphone_number", //non-madatory
                "parents_ph" :"newparents_ph",
                "dob" :"30-01-1998",
                "email" :"email@gmail.com", //non-madatory
                "class_name" :"new_class_name", //non-madatory
                "division_name" :"new_division_name", //non-madatory
                "hostel_details" :"new_hostel_details", //non-madatory
                "member_type_id" :1,
                "address" :"new address", //non-madatory
                "opening_balance" :1
            }
        ]
    }
    
    b. To update Member:
        post: /api/v1/member_ops/update
        payload: {
            "member_id":4,
            "full_name" :"newfull_name",
            "gender" :"newgender",
            "phone_number" :"newphone_number", //non-madatory
            "parents_ph" :"newparents_ph",
            "dob" :"30-01-1998",
            "email" :"email@gmail.com", //non-madatory
            "class_name" :"new_class_name", //non-madatory
            "division_name" :"new_division_name", //non-madatory
            "hostel_details" :"new_hostel_details", //non-madatory
            "member_type_id" :1,
            "address" :"new address" //non-madatory
        }

    c. To update the card number
        post: /card_update
        payload : {
            "member_id":1,
            "card_number":"New Card Number",
            "reason": "Card Lost"
        }

    d. To delete Member:
        post: /api/v1/member_ops/delete
        payload:{
            "member_id":4
        }

13. API to fetch Specific Member data:
    get: /api/v1/specific_data/MEMBER/member_id

14. API to fetch Card Update details of specific member
    get: /api/v1/table_data/CARD_UPDATE_DETAILS/member_id

15. API to fetch Card Update details of logged in counter
    get: /api/v1/table_data/CARD_UPDATE_DETAILS

16. API to fetch all the members in the Counter:
        get: /api/v1/table_data/MEMBER

17. API to fetch Self Counter's details:
    get: /api/v1/specific_data/COUNTER/MY_COUNTER

18. API to get self counter's license
    get: /api/v1/table_data/COUNTER_LICENSE/MY_COUNTER

Smart Canteen Updates:

19. API to Operate on Income/Expense Account Head
    a. To create new Account Head
        post: /account_head_ops/insert
        payload:{
                    "account_name":"SBAAI BANK",
                    "opening_balance" : 100,
                    "isExpenseHead" : 0
                }
    
    b. To update Account Head Name
        post: /account_head_ops/update
        payload:{
                    "account_head_id" : 1,
                    "account_name":"SBAAI BANK"
                }
    
    c. To delete account head
        post: /account_head_ops/delete
        payload:{
            "account_head_id" : 1,
        }

20. API to fetch Account head details
    a. API to fetch all account heads
        get: /table_data/ACCOUNT_HEAD

    b. API to fetch only Income account head
        get: /table_data/INCOME_ACCOUNT_HEAD
    
    c. API to fetch only Expense account head
        get: /table_data/EXPENSE_ACCOUNT_HEAD
    
    d. API to fetch sepcific account head
        get: /specific_data/ACCOUNT_HEAD/account_head_id

21. API to Operate on Transactions
    a. To refill member's wallet balance
        post: /transaction_ops/MEMBER_WALLET_REFILL
        payload: {
                    "member_id" : 1,
                    "txn_amount" : 100,
                    "txn_date" : "04-02-2023",
                    "txn_discount" : 0, //non-mandatory
                    "payment_mode" : "Mode",
                    "payment_ref" : "Payment Ref", //non-mandatory
                    "user_comments" : "user comments", //non-mandatory
                    "account_head_id" : 3 //this should be income account head
                }
    
    b. To take amount credit to income account head
        post: /transaction_ops/ACC_HEAD_INCOME_CREDIT
        payload: {
                    "txn_amount" : 100,
                    "txn_date" : "04-02-2023",
                    "txn_discount" : 0, //non-mandatory
                    "payment_mode" : "Mode",
                    "payment_ref" : "Payment Ref",
                    "user_comments" : "user comments",
                    "account_head_id" : 3
                }
    
    c. To transfer the amount from income account to expense account, i.e. Expense Entry
        post: /transaction_ops/EXPENSE_ENTRY
        payload: {
                    "source_head_id": 3,
                    "destination_head_id": 2,
                    "txn_amount" : 100,
                    "txn_date" : "04-02-2023",
                    "txn_discount" : 0, //non-mandatory
                    "payment_mode" : "Mode",
                    "payment_ref" : "Payment Ref",
                    "user_comments" : "user comments"  
                }
