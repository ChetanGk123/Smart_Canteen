<!-- Smart Canteen Updates:

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
    get: /api/v1/table_data/CANTEEN -->

3. To fetch the role
   get: /api/v1/table_data/ROLE

<!-- 4. API to operate on Counter Data //Done
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
    get: /api/v1/specific_data/COUNTER_LICENSE/counter_id -->

9. To fetch all the licenses across the system
   get: /api/v1/table_data/COUNTER_LICENSE

<!-- To be implemented on GUI:

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
    get: /api/v1/table_data/CARD_UPDATE_DETAILS/member_id -->

<!-- 15. API to fetch Card Update details of logged in counter
    get: /api/v1/table_data/CARD_UPDATE_DETAILS -->

<!-- 16. API to fetch all the members in the Counter:
        get: /api/v1/table_data/MEMBER -->

<!-- 17. API to fetch Self Counter's details:
    get: /api/v1/specific_data/COUNTER/MY_COUNTER

18. API to get self counter's license
    get: /api/v1/table_data/COUNTER_LICENSE/MY_COUNTER -->

<!--  Smart Canteen Updates:

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
        get: /specific_data/ACCOUNT_HEAD/account_head_id -->

<!-- 21. API to Operate on Transactions
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
                } -->

<!-- Smart Canteen Updates:

1. API to retrieve member information by card number
    get: specific_data/MEMBER_DATA/card_number -->

<!-- 2. Retrieving transaction data
    a. Member related transaction
        API: post /transaction_data/MEMBER_TRANSACTIONS
        payload: {
            "member_id":1,
            "start_date":"04-02-2023",
            "end_date":"07-02-2023"
        }
    b. Account related transactions
        API: /transaction_data/ACCOUNT_HEAD_TRANSACTIONS
        payload: {
            "account_head_id":1,
            "start_date":"04-02-2023",
            "end_date":"07-02-2023"
        }
    c. API to fetch all the transactions
        API: /transaction_data/ALL_TRANSACTIONS
        payload: {
            "start_date":"04-02-2023",
            "end_date":"07-02-2023"
        }
    Note:
        1. All three parameters in payload are non-mandatory (Consider this note for 2.a, 2.b, 2.c)
        2. Remove date filters to receive all transactions for Member/Account/All transactions (Consider this note for 2.a, 2.b, 2.c)
        3. Remove ID filters to receive the transactions within date irrespective of member/account head (Consider this note for 2.a & 2.b) -->

<!-- 1. API to operate on different items options:{UOM, GST_SLAB, POS_MAIN_CATEGORY}, operation:{insert, update, delete}
    API: post /item_ops/options/operation
    payload:{
        "item_name":"15",
        "item_id":2, // mandatory to update & delete
        "counter_id":3 //non-mandatory
    }

2. API to fetch different items
    API: get /table_data/{UOM, GST_SLAB, POS_PARTICULAR, POS_MAIN_CATEGORY}

3. API to fetch specific data items
    API: get /specific_data/{UOM, GST_SLAB, POS_PARTICULAR, POS_MAIN_CATEGORY}/item_id

4. To operate on POS Particular
    a. API to insert new POS Particular
        API: post /pos_particular_ops/insert
        payload:{
            "name"             : "naaame", //mandatory
            "uom_id"           : 1, //mandatory
            "hsn_code"         : "hsn_code",
            "gst_slab_id"      : 1,
            "discount_amt"     : 0,
            "discount_per"     : 1,
            "isExclusiveGst"   : 1,
            "rate"             : 12, //mandatory
            "main_category_id" : 1,
            "counter_id"       : 1
        }

    b. API to update POS Particular
        API: post /pos_particular/update
        payload:{
            "id"               : 4, //mandatory
            "name"             : "naaame", //mandatory
            "uom_id"           : 1, //mandatory
            "hsn_code"         : "hsn_code",
            "gst_slab_id"      : 1,
            "discount_amt"     : 0,
            "discount_per"     : 1,
            "isExclusiveGst"   : 1,
            "rate"             : 12, //mandatory
            "main_category_id" : 1,
            "counter_id"       : 1
        }

5. To fetch POS Particular
    a. API to fetch All particulars
        API: get /table_data/POS_PARTICULAR

    b. API to fetch specific particular data
        API: get /specific_data/POS_PARTICULAR/particular_id -->

<!-- Smart Canteen Updates:

1. API to mark the POS Sales
    Note: POS Sales can be made for both Registered & Non-Registered Members
    a. API to mark POS Sales for Non-Registered Members
        API: post /mark_pos_sales
            payload: {
                        "customer_name": "Chetan",
                        "customer_ph": "",
                        "sale_date": "13-02-2023", //mandatory
                        "member_id": null,
                        "account_head_id":1, //this is mandatory & should be income account head to recieve the amount paid by Non Registered Member
                        "payment_mode": "",
                        "payment_ref": "",
                        "service_charge_per": 0,
                        "service_charge_amt": 0,
                        "packaging_amt": 0,
                        "sales_array": [
                            {
                                "id": 1, //mandatory
                                "actual_discount_amt": "10.00",
                                "actual_discount_per": "0.00",
                                "sale_qty": 1, //mandatory
                                "sale_rate": 121 //mandatory
                            }
                        ]
                    }
    b. API to mark POS Sales for Registered Members
        API: post /mark_pos_sales
            payload: {
                        "customer_name": "",
                        "customer_ph": "",
                        "sale_date": "13-02-2023", //mandatory
                        "member_id": 1, //mandatory
                        "account_head_id":null,
                        "payment_mode": "",
                        "payment_ref": "",
                        "service_charge_per": 0,
                        "service_charge_amt": 0,
                        "packaging_amt": 0,
                        "sales_array": [
                            {
                                "id": 1, //mandatory
                                "actual_discount_amt": "10.00",
                                "actual_discount_per": "0.00",
                                "sale_qty": 1, //mandatory
                                "sale_rate": 121 //mandatory
                            }
                        ]
                    }

2. API to fetch the POS Sales List
    API: get /table_data/POS_SALES -->

3. API to get all the information related to Specific POS Sales
   API: get /pos_sale_data/pos_sale_id

Smart Canteen Updates:

1. API to create a setting
   a. API: post /settings_ops/insert
   payload: {
   "display_label": "Display aName",
   "settings_name":"UDATaaassaaaaaaaaaaD",
   "settings_value":1,
   "isDisplay" : 0,
   "isDeletable": 0
   }
   b. API: post /settings_ops/update
   payload: {
   "settings_id": 3,
   "display_label": "Display aName",
   "settings_name":"UDATaaassaaaaaaaaaaD",
   "settings_value":1,
   "isDisplay" : 0,
   "isDeletable": 1
   }

2. API to fetch canteen related settings (only accessible through Canteen Login)
   get /table_data/CANTEEN_SETTINGS

3. API to fetch canteen related specific settings (only accessible through Canteen Login)
   get /specific_data/CANTEEN_SETTINGS/settings_id

4. API to fetch the counter wise settings data (only accessible through Canteen Login)
   post /settings_ops/FETCH_GROUPED

5. API to fetch counter settings
   get /table_data/SETTINGS

6. API to fetch specific counter settings
   get /specific_data/SETTINGS/settings_id

Initial Settings on registration of every canteen & counter

1. Canteen
   a. Theme Color, THEME_COLOR, dark
   b. Date Range, DATE_RANGE, 10

2. Counter (these settings will be generated on every new registration of counter)
   a. Theme Color, THEME_COLOR, dark
   b. Date Range, DATE_RANGE, 10
   c. Send SMS on Every Tap, SMS_ON_EVERY_TAP, 1
   d. Minimum Card Balance, MINIMUM_CARD_BALANCE, 100
