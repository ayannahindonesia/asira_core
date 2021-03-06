exports.listAllRolePermission = [
    // Bank Core
    {
        id: 'core_bank_list',
        label: 'List and Detail',
        modules: 'core_bank_list core_bank_detail',
        menu: 'Bank (Core)',
    },
    {
        id: 'core_bank_new',
        label: 'Add',
        modules: 'core_bank_new',
        menu: 'Bank (Core)',
    },
    {
        id: 'core_bank_patch',
        label: 'Edit',
        modules: 'core_bank_patch',
        menu: 'Bank (Core)',
    },
    // Nasabah Core
    {
        id: 'core_borrower_get_all',
        label: 'List and Detail',
        modules: 'core_borrower_get_all core_borrower_get_details',
        menu: 'Nasabah (Core)',
    },
    // Nasabah Bank Dashboard
    {
        id: 'lender_borrower_list',
        label: 'List and Detail',
        modules: 'lender_borrower_list lender_borrower_list_detail',
        menu: 'Nasabah (Bank Dashboard)',
    },
    // Pinjaman Core
    {
        id: 'core_loan_get_all',
        label: 'List and Detail',
        modules: 'core_loan_get_all core_loan_get_details',
        menu: 'Pinjaman (Core)',
    },
    // Pinjaman Bank Dashboard
    {
        id: 'lender_loan_request_list',
        label: 'List and Detail',
        modules: 'lender_loan_request_list lender_loan_request_detail',
        menu: 'Pinjaman (Bank Dashboard)',
    },
    {
        id: 'lender_loan_request_list_download',
        label: 'Download',
        modules: 'lender_loan_request_list_download',
        menu: 'Pinjaman (Bank Dashboard)',
    },
    {
        id: 'lender_loan_confirm_disburse',
        label: 'Disburse',
        modules: 'lender_loan_confirm_disburse',
        menu: 'Pinjaman (Bank Dashboard)',
    },
    {
        id: 'lender_loan_approve_reject',
        label: 'Approval',
        modules: 'lender_loan_approve_reject lender_loan_change_disburse_date',
        menu: 'Pinjaman (Bank Dashboard)',
    },
    // Layanan Core
    {
        id: 'core_service_list',
        label: 'List and Detail',
        modules: 'core_service_list core_service_detail',
        menu: 'Layanan (Core)',
    },
    {
        id: 'core_service_new',
        label: 'Add',
        modules: 'core_service_new',
        menu: 'Layanan (Core)',
    },
    {
        id: 'core_service_patch',
        label: 'Edit',
        modules: 'core_service_patch',
        menu: 'Layanan (Core)',
    },
    // Produk Core
    {
        id: 'core_product_list',
        label: 'List and Detail',
        modules: 'core_product_list core_product_detail',
        menu: 'Produk (Core)',
    },
    {
        id: 'core_product_new',
        label: 'Add',
        modules: 'core_product_new',
        menu: 'Produk (Core)',
    },
    {
        id: 'core_product_patch',
        label: 'Edit',
        modules: 'core_product_patch',
        menu: 'Produk (Core)',
    },
    // Tipe Bank Core
    {
        id: 'core_bank_type_list',
        label: 'List and Detail',
        modules: 'core_bank_type_list core_bank_type_detail',
        menu: 'Tipe Bank (Core)',
    },
    {
        id: 'core_bank_type_new',
        label: 'Add',
        modules: 'core_bank_type_new',
        menu: 'Tipe Bank (Core)',
    },
    {
        id: 'core_bank_type_patch',
        label: 'Edit',
        modules: 'core_bank_type_patch',
        menu: 'Tipe Bank (Core)',
    },
    // Tujuan Core
    {
        id: 'core_loan_purpose_list',
        label: 'List and Detail',
        modules: 'core_loan_purpose_list core_loan_purpose_detail',
        menu: 'Tujuan (Core)',
    },
    {
        id: 'core_loan_purpose_new',
        label: 'Add',
        modules: 'core_loan_purpose_new',
        menu: 'Tujuan (Core)',
    },
    {
        id: 'core_loan_purpose_patch',
        label: 'Edit',
        modules: 'core_loan_purpose_patch',
        menu: 'Tujuan (Core)',
    },
    // Role Core
    {
        id: 'core_role_list',
        label: 'List and Detail',
        modules: 'core_role_list core_role_details',
        menu: 'Role (Core)',
    },
    {
        id: 'core_role_new',
        label: 'Add',
        modules: 'core_role_new',
        menu: 'Role (Core)',
    },
    {
        id: 'core_role_patch',
        label: 'Edit',
        modules: 'core_role_patch',
        menu: 'Role (Core)',
    },
    // Permission Core
    {
        id: 'core_permission_list',
        label: 'List and Detail',
        modules: 'core_permission_list core_permission_detail core_role_list core_role_details',
        menu: 'Role Permission (Core)',
    },
    {
        id: 'core_permission_new',
        label: 'Add',
        modules: 'core_permission_new core_role_patch',
        menu: 'Role Permission (Core)',
    },
    {
        id: 'core_permission_patch',
        label: 'Edit',
        modules: 'core_permission_patch core_role_patch',
        menu: 'Role Permission (Core)',
    },
    // User Core
    {
        id: 'core_user_list',
        label: 'List and Detail',
        modules: 'core_user_list core_user_details',
        menu: 'Akun (Core)',
    },
    {
        id: 'core_user_new',
        label: 'Add',
        modules: 'core_user_new',
        menu: 'Akun (Core)',
    },
    {
        id: 'core_user_patch',
        label: 'Edit',
        modules: 'core_user_patch',
        menu: 'Akun (Core)',
    },
    // Convenience Fee Report
    {
        id: 'convenience_fee_report',
        label: 'List and Detail',
        modules: 'convenience_fee_report',
        menu: 'Report (Core)',
    },
    // Penyedia Agen Core
    {
        id: 'core_agent_provider_list',
        label: 'List and Detail',
        modules: 'core_agent_provider_list core_agent_provider_details',
        menu: 'Penyedia Agen (Core)',
    },
    {
        id: 'core_agent_provider_new',
        label: 'Add',
        modules: 'core_agent_provider_new',
        menu: 'Penyedia Agen (Core)',
    },
    {
        id: 'core_agent_provider_patch',
        label: 'Edit',
        modules: 'core_agent_provider_patch',
        menu: 'Penyedia Agen (Core)',
    },
    // Agent Core
    {
        id: 'core_agent_list',
        label: 'List and Detail',
        modules: 'core_agent_list core_agent_details',
        menu: 'Agen (Core)',
    },
    {
        id: 'core_agent_new',
        label: 'Add',
        modules: 'core_agent_new',
        menu: 'Agen (Core)',
    },
    {
        id: 'core_agent_patch',
        label: 'Edit',
        modules: 'core_agent_patch',
        menu: 'Agen (Core)',
    },
     // Calon Nasabah Core
     {
        id: 'core_borrower_get_all',
        label: 'List and Detail',
        modules: 'core_borrower_get_all core_borrower_get_details',
        menu: 'Calon Nasabah (Core)',
    },
    // Calon Nasabah Dashboard
    {
        id: 'lender_borrower_list',
        label: 'List and Detail',
        modules: 'lender_borrower_list lender_borrower_list_detail',
        menu: 'Calon Nasabah (Bank Dashboard)',
    },
    {
        id: 'lender_prospective_borrower_approval',
        label: 'Approval',
        modules: 'lender_prospective_borrower_approval',
        menu: 'Calon Nasabah (Bank Dashboard)',
    },

]
