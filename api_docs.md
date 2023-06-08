Cooksbooks Updates:
API Link: https://thetechvaidya.com/cooksbook_new/api/v1
Owner Credentials: owner@canteen.com, owner@canteen.com
Counter Credentials: counter@gmail.com, counter@gmail.com

Note: All the things remain same as Mealmate software
Changes in existing API:

1. While registering members, division_name & class_name should be registered into system i.e. from /table_data/CLASS or /table_data/DIVISION
   If you send the class/division that is not registered then NULL will be stored automatically

Below are new Features:

1.  To Operate on Meal Type, e.g. Breakfast, Lunch, Dinner
    a. To register new Meal Type:
    API: post /items_ops/MEAL_TYPE/insert
    Payload: {
    "item_name":"DINNER"
    }

    b. To update Meal Type:
    API: post /items_ops/MEAL_TYPE/update
    Payload: {
    "item_name":"Supper",
    "item_id":2
    }

    c. To delete Meal Type:
    API: post /items_ops/MEAL_TYPE/delete
    Payload: {
    "item_id":2
    }

    d. To fetch Meal Types
    API: get /table_data/MEAL_TYPE

    c. To fetch specific Meal Type
    API: get /specific_data/MEAL_TYPE/2

2.  To Operate on Meal Pack Name e.g. Full Mess, Short Time Mess
    a. To register new Meal Pack Name:
    API: post /meal_pack_name_ops/insert
    Payload: {
    "meal_pack_name":"Short Term Mess"
    }

    b. To update Meal Pack Name:
    API: post /meal_pack_name_ops/update
    Payload: {
    "meal_pack_name":"Long term mess",
    "meal_pack_id":2
    }

    c. To delete Meal Pack Name:
    API: post /meal_pack_name_ops/delete
    Payload: {
    "meal_pack_id":2
    }

    d. To fetch Meal Pack Names
    API: get /table_data/MEAL_PACK_NAME

    c. To fetch specific Meal Type
    API: get /specific_data/MEAL_PACK_NAME/2

3.  To operate on meal pack, i.e. To register the meal packs so that customer can assign to members
    a. To register new meal pack
    API: post /meal_pack_ops/insert
    Payload: {
    "meal_pack_id":2, // this is the Meal Pack Name ID
    "meals_array":[
    {
    "meal_id": 1, // This is Meal Type ID
    "meal_price":50,
    "meal_start_time":"10:30:00", // Time should be in <hh:mm:ss a> format e.g. 08:30:00 AM, 01:00:00 PM
    "meal_end_time":"11:30:00" // Time should be in <hh:mm:ss a> format e.g. 08:30:00 AM, 01:00:00 PM
    },
    {
    "meal_id": 2, // This is Meal Type ID
    "meal_price":60,
    "meal_start_time":"10:30:00", // Time should be in <hh:mm:ss a> format e.g. 08:30:00 AM, 01:00:00 PM
    "meal_end_time":"11:30:00" // Time should be in <hh:mm:ss a> format e.g. 08:30:00 AM, 01:00:00 PM
    }
    ]
    }

    b. To update the meal price, meal start & end time of a specific meal in a Meal Pack
    API: post /meal_pack_ops/update
    Payload: {
    "meal_pack_item_id": 5, // this is unqiue meal pack item ID being registered for every meal in a meal pack
    "meal_price":123,
    "meal_start_time":"01:00:00",
    "meal_end_time":"01:30:00"
    }

    c. To delete a Meal from Meal Pack
    API: post /meal_pack_ops/delete
    Payload: {
    "meal_pack_item_id": 5, // this is unqiue meal pack item ID being registered for every meal in a meal pack
    }

    d. To fetch structered meal pack data
    API: get /meal_pack_data

    e. To fetch the meals in a meal pack
    API: get /table_data/MEAL_PACK_ITEMS/meal_pack_id

4.  To Operate on Academic Particulars. option: CLASS, DIVISION
    a. To register academic particular
    API: post /item_ops/<option>/insert
    Payload: {
    "item_name":"Class Name"
    }
    b. To updated academic particular
    API: post /items_ops/<option>/update
    Payload: {
    "item_name":"Updated",
    "item_id":1
    }
    c. To delete academic particular
    API: /item_ops/<option>/delete
    Payload: {
    "item_id":1
    }
    d. To fetch academic particulars
    API: /table_data/<option>
    e. To fetch specific academic particular
    API: /specific_data/<option>/2

5.  To fetch only Meal Account
    a. To fetch all account
    API: get /table_data/COMMODITY_ACCOUNT
    b. To fetch specific meal account
    API: get /specific_data/COMMODITY_ACCOUNT/id

6.  To operate on membership
    a. To assign membership
    API: post /membership_ops/new
    payload:{
    "member_id" : 3, //mandatory
    "meal_pack_id" : 5, //mandatory
    "total_meal_packs" : 25, //mandatory
    "max_days" : 30, //mandatory
    "start_date" : "08-05-2023", //mandatory
    "payment_date" : null,
    "payment_account_head_id" : 1, //mandatory if paid_amount>0
    "payment_mode" : "Mode",
    "payment_ref" : "Ref",
    "payment_comments" : "Comments",
    "counter_id" : null,
    "paid_amount" : 5000
    }
    b. To cancel membership
    API: post/membership_ops/cancel
    payload: {
    "member_id" : 3, //mandatory
    "cancellation_comments" : "member cancel", //mandatory
    "cancellation_date" : "17-05-2023", //mandatory
    "isSettleFromBalance" : false, // to make existing dues as zero
    "addRetunableAmountToWallet" : false, // to add returnable amount to member wallet
    "account_head_id" : 1, //mandatory if returnable_amount > 0
    "counter_id" : null,
    "returnable_amount" : 500,
    "txn_date" : "17-05-2023", //mandatory if returnable_amount > 0
    "txn_comments" : "Txn comments",
    "payment_mode" : "payment mode",
    "payment_ref" : "payment ref"
    }
7.  To fetch structured membership data
    OPTION_HERE : {
    membership_wise_options:{
    ALL_MEMBERSHIPS
    ACTIVE_MEMBERSHIPS
    INACTIVE_MEMBERSHIPS
    ACTIVE_LEAVE_MEMBERSHIPS
    INACTIVE_LEAVE_MEMBERSHIPS
    }

                    member_wise_options:{
                        ALL_MEMBERSHIPS_BY_MEMBER
                        ACTIVE_MEMBERSHIPS_BY_MEMBER
                        INACTIVE_MEMBERSHIPS_BY_MEMBER
                        ACTIVE_LEAVE_MEMBERSHIPS_BY_MEMBER
                        INACTIVE_LEAVE_MEMBERSHIPS_BY_MEMBER
                    }
                }

    API: get /membership_data?what=OPTION_HERE&member_id=4&membership_id=1&membership_start_date=24-05-2023&membership_end_date=24-05-2023
    Note:

    1. Use member_id with member_wise_options
    2. User membership_id with membership_wise_options
    3. membership_start_date & membership_end_date can be used when you need the data based on date filter. Start & End date are optional

8.  To operate on time/date based constraints for POS Items
    a. To add new constraints
    API: post /pos_constraint_ops/insert
    Payload:{
    "pos_particular_id" : 1,
    "constraints_array":[
    {
    "start_time": "00:00:00",
    "end_time" : "00:59:00",
    "start_date": "01-01-2023",
    "end_date": "01-01-2023"
    },
    {
    "start_time": "12:00:00 PM",
    "end_time" : "01:30:00 PM",
    "start_date": "23-01-2023",
    "end_date": "23-01-2023"
    }
    ]
    }

    b. To delete the date/time POS contraint
    API: post /pos_constraint_ops/delete
    Payload:{
    "pos_constraint_id":2
    }

    c. To fetch the POS contraints for particular POS Item
    API: get /table_data/POS_CONSTRAINTS/pos_particualr_id

    d. To Update the POS Date/time contraint
    API: pot /pos_constraint_ops/update
    payload: {
    "pos_constraint_id" : 2,
    "start_time": "10:00:00 AM",
    "end_time" : "12:00:00 PM",
    "start_date": "01-01-2023", // non-mandatory
    "end_date": "01-01-2023" // non-mandatory
    }

9.  To operate on Academic Constraints for POS Particular
    a. Add new constraint
    API: post /academic_constraint_ops/insert
    payload: {
    "pos_particular_id" : 1,
    "constraints_array":[
    {
    "class_id": 4, // mandatory if division_id is NULL
    "division_id" : 2, // mandatory if class_id is NULL
    "rate": 50 // mandatory
    }
    ]
    }

    b. To fetch Academic POS Constratins
    API: get /table_data/ACADEMIC_POS_CONSTRAINTS/pos_particular_id

    c. To update Academic POS Constraint
    API: post /academic_constraint_ops/update
    payload: {
    "pos_academic_constraint_id":1,
    "class_id": 4, // mandatory if division_id is NULL
    "division_id" : 2, // mandatory if class_id is NULL
    "rate": 50 // mandatory
    }

    d. To delete Academic POS Contraint
    API: post /academic_constraint_ops/delete
    pyload: {
    "pos_academic_constraint_id":4
    }

10. To fetch member info by card number
    API: get /specific_data/MEMBER_BY_CARD_NUMBER/card_number

11. To fetch membership sale history
    Option: {
    DATEWISE_MEMBERSHIP_SALE_HISTORY - Returns the sale history based on date,
    MEAL_PACK_NAMEWISE_MEMBERSHIP_SALE_HISTORY - Returns the sale history based on meal pack name
    }
    API: get sales_history/MEMBERSHIP?what=option&meal_pack_id=1&sale_start_date=17-05-2023&sale_end_date=18-05-2023
    Note:

    1. meal_pack_id should be mentioned if you wanna fetch specific meal pack's sale history. meal_pack_id is optional
    2. sale_start_date & sale_end_date are optional

12. Attendance OPS
    a. Mark attendance
    API: get /mark_attendance/card_number

    b. Clear attendance
    API: get /clear_attendance?member_id=5
    Note: 1. Use member_id to clear attendance of specific member 2. member_id is not used then all attendance will be cleared

    c. To fetch the attendance data
    options: {ALL_ATTENDANCE, ATTENDANCE_BY_MEMBER, ATTENDANCE_BY_MEMBERSHIP}
    API: get /attendance_data?what=options&attendance_start_date=17-05-2023&attendance_end_date=06-06-2023&member_id=3&membership_id=1
    Note: 1. Use combination of member_id & membership_id to get customised attendance data

13. To fetch POS Sales history
    option : {POS_PARTICULARWISE_POS_SALE_HISTORY, DATEWISE_POS_SALE_HISTORY}
    API: get /sales_history/POS_SALES?sale_start_date=17-05-2022&sale_end_date=18-05-2023&pos_particular_id=1&what=option
    Note:

    1. pos_particular_id is optional & can be used to fetch particular POS Sales History

14. To operate on leave
    a. Start leave
    API: post /leave_ops/start
    payload: {
    "leave_array":[
    {
    "member_id": 3,
    "leave_date": "23-05-2023" // this would be leave start date
    }
    ]
    }
    b. End Leave
    API: post /leave_ops/end
    payload: {
    "leave_array":[
    {
    "member_id": 3,
    "leave_date": "23-05-2023" // this would be leave end date
    }
    ]
    }
    c. Fetch the leave data based on different filters
    Glossary:

    1.  Active leave: When member has started leave & not yet ended
    2.  Inactive leave: Member's leave has ended & membership is resumed
        options :{
        ALL_LEAVES,
        ACTIVE_LEAVES,
        INACTIVE_LEAVES,

            ALL_LEAVES_BY_MEMBER,
            ACTIVE_LEAVES_BY_MEMBER,
            INACTIVE_LEAVES_BY_MEMBER,

            ALL_LEAVES_BY_MEMBERSHIP,
            ACTIVE_LEAVES_BY_MEMBERSHIP,
            INACTIVE_LEAVES_BY_MEMBERSHIP

        }
        API: get /leave_data?member_id=3&what=options&leave_id=1&membership_id=1&leave_start_date=23-05-2023&leave_end_date=24-05-2023
        Note:
        usage example: Use comibnation of membership_id & member_id to get leaves of specific member on specific membership

15. To fetch members with inactive memberships
    API: get /table_data/INACTIVE_MEMBERSHIP_MEMBERS

16. To fetch members with balance

    1. Currently we are having prepaid & postpaid options into the system.
    2. Member can avail the food even if the there is no balance in the account
    3. If balance is less than zero then that member must pay that much of balance, so it's better to validate the member data on UI side only
    4. If balance is greater than zero then that member has that much of amount in his/her wallet

17. There is a setting named as SETTINGS_WALLET_TRANSACTION_TYPE
    1. if SETTINGS_WALLET_TRANSACTION_TYPE is set to 0 then wallet transaction mode would be Prepaid, which means member will not be allowed to make POS Purchase without sufficient balance
    2. if SETTINGS_WALLET_TRANSACTION_TYPE is set to 1 then wallet transaction mode would be Postpaid, which means member will be allowed to make POS Purchase without sufficient balance
       Note: Do test this in POS Sales
