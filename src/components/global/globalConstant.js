exports.dataMenu = [
    // Bank, Produk, Service, Tipe Core
    {
        label: 'Mitra',
        logo: '',
        system:'Core',
        child: [
            {
                label: 'Mitra',
                logo: '',
                link:'/mitraList',
                action: {
                    list:'core_bank_list core_bank_detail',
                    add:'core_bank_new',
                    edit:'core_bank_patch',
                }
            },
            {
                label: 'Layanan',
                logo: '',
                link:'/layananList',
                action: {
                    list:'core_service_list core_service_detail',
                    add:'core_service_new',
                    edit:'core_service_patch',
                }
            },
            {
                label: 'Produk',
                logo: '',
                link:'/produkList',
                action: {
                    list:'core_product_list core_product_detail',
                    add:'core_product_new',
                    edit:'core_product_patch',
                }
            },
            {
                label: 'Tipe Mitra',
                logo: '',
                link:'/tipeList',
                action: {
                    list:'core_bank_type_list core_bank_type_detail',
                    add:'core_bank_type_new',
                    edit:'core_bank_type_patch',
                }
            },
        ]
    },
    // Produk & Layanan Dashboard
    {
        label: 'Produk & Layanan',
        logo: '',
        system:'Bank Dashboard',
        child: [
            {
                label: 'Produk',
                logo: '',
                link:'/produk',
                action: {
                    list:'lender_product_list lender_product_list_detail',
                }
            },
            {
                label: 'Layanan',
                logo: '',
                link:'/layanan',
                action: {
                    list:'lender_service_list lender_service_list_detail',
                }
            },
        ]
    },
    // Nasabah, Calon Nasabah Core
    {
        label: 'Nasabah',
        logo: 'nasabah.svg',
        system:'Core',
        child:[
            {
                label: 'Nasabah',
                logo: 'nasabah.svg',
                link:'/nasabahList',
                action: {
                    list:'core_borrower_get_all core_borrower_get_details',
                }
            },
            {
                label: 'Calon Nasabah',
                link:'/calonNasabahList',
                logo: 'calonNasabah.svg',
                action: {
                    list:'core_borrower_get_all core_borrower_get_details',
                }
            },
            {
                label: 'Calon Nasabah Arsip',
                link:'/calonNasabahArsipList',
                logo: 'calonNasabah.svg',
                action: {
                    list:'core_borrower_get_all core_borrower_get_details',
                }
            },
            {
                label: 'User Mobile',
                link:'/userMobileList',
                logo: 'calonNasabah.svg',
                action: {
                    list:'core_borrower_get_all core_borrower_get_details',
                }
            },
        ],
        
    },
    // Nasabah, Calon Nasabah Dashboard
    {
        label: 'Nasabah',
        logo: '',
        system:'Bank Dashboard',
        child:[
            {
                label: 'Nasabah',
                logo: '',
                action: {
                    list:'lender_borrower_list lender_borrower_list_detail',
                    delete:'lender_approve_reject_borrower_delete_request'
                }
            },
            {
                label: 'Calon Nasabah',
                logo: '',
                action: {
                    list:'lender_borrower_list lender_borrower_list_detail',
                    approval:'lender_prospective_borrower_approval',
                }
            },
        ],
        
    },
    // Pinjaman, Tujuan Core
    {
        label: 'Pinjaman',
        logo: 'pinjaman.svg',
        system:'Core',
        action: {
            list:'core_loan_get_all core_loan_get_details',
        },
        child:[
            {
                label: 'Pinjaman',
                logo: 'pinjaman.svg',
                link:'/pinjamanList',
                action: {
                    list:'core_loan_get_all core_loan_get_details',
                },
            },
            {
                label: 'Tujuan',
                logo: '',
                link:'/tujuanList',
                action: {
                    list:'core_loan_purpose_list core_loan_purpose_detail',
                    add:'core_loan_purpose_new',
                    edit:'core_loan_purpose_patch',
                }
            }
        ]
    },
    // Pinjaman Dashboard
    {
        label: 'Pinjaman',
        logo: '',
        system:'Bank Dashboard',
        action: {
            list:'lender_loan_request_list lender_loan_request_detail',
            download:'lender_loan_request_list_download',
            disburse:'lender_loan_confirm_disburse',
            approval:'lender_loan_approve_reject lender_loan_change_disburse_date',
        }
    },    
    // Installment Dashboard
    {
        label: 'Cicilan & Pembayaran',
        logo: '',
        system:'Bank Dashboard',
        action: {
            list:'lender_loan_request_list_installment_list',
            edit:'lender_loan_installment_approve',
            approval:'lender_loan_patch_payment_status lender_loan_installment_approve_bulk',
        }
    },    
    // User, Role, Permission Core
    {
        label: 'User',
        logo: '',
        system:'Core',
        child:[
            {
                label: 'User',
                logo: '',
                link:'/akunList',
                action: {
                    list:'core_user_list core_user_details',
                    add:'core_user_new',
                    edit:'core_user_patch',
                }
            },
            {
                label: 'Role',
                logo: '',
                link:'/roleList',
                action: {
                    list:'core_loan_purpose_list core_loan_purpose_detail',
                    add:'core_loan_purpose_new',
                    edit:'core_loan_purpose_patch',
                }
            },
            {
                label: 'Permission',
                logo: '',
                link:'/permissionList',
                action: {
                    list:'core_permission_list core_permission_detail core_role_list core_role_details',
                    add:'core_permission_new core_role_patch',
                    edit:'core_permission_patch core_role_patch',
                }
            }
        ]
    },
    // Agen, Penyedia Agen Core
    {
        label: 'Agen',
        logo: '',
        system:'Core',
        child:[
            {
                label: 'Penyedia Agen',
                logo: '',
                link:'/penyediaList',
                action: {
                    list:'core_agent_provider_list core_agent_provider_details',
                    add:'core_agent_provider_new',
                    edit:'core_agent_provider_patch',
                }
            },
            {
                label: 'Agen',
                logo: '',
                link:'/agenList',
                action: {
                    list:'core_agent_list core_agent_details',
                    add:'core_agent_new',
                    edit:'core_agent_patch',
                }
            },
        ]
    },
    // Logs
    {
        label: 'Logs',
        logo: '',
        system:'Core',
        child:[
            {
                label: 'Activity Logs',
                logo: '',
                link:'/activityLog',
                action: {
                    list: 'core_activity_logs core_activity_logs_detail',
                }
            },
            {
                label: 'Auditrail',
                logo: '',
                link:'/auditTrail',
                action: {
                    list:'core_auditrail core_auditrail_detail',
                }
            },
        ]
    },
    // FAQ
    {
        label: 'FAQ',
        logo: '',
        system:'Core',
        link:'/FAQ',
        action: {
            list:'core_faq_list core_faq_detail',
            add:'core_faq_new',
            edit:'core_faq_patch',
            delete:'core_faq_delete'
        }
    },
    // Convenience Fee Report
    {
        label: 'Report',
        logo: '',
        system:'Core',
        link:'/report',
        action: {
            list:'convenience_fee_report',
        }
    },
    // Keluar
    {
        label: 'Keluar',
        logo: 'keluar.svg',
        system: 'Core',
    },
]