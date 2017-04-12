"use strict";

module.exports = {
    general: {
        title: 'Tùy chỉnh chung',
        icon: 'fa fa-cog',
        fieldGroups: {
            footer: {
                title: 'Footer',
                image: 'footer.jpg',
                fields: {
                    footer_menu: {
                        name: 'Tiêu đề Liên kết',
                        type: 'text',
                    },
                    footer_newsletter: {
                        name: 'Tiêu đề Newsletter',
                        type: 'text',
                    },
                    footer_newsletter_desc: {
                        name: 'Miêu tả',
                        type: 'textarea',
                    },
                    footer_sign_left: {
                        name: 'Chân trang - bên trái',
                        type: 'textarea',
                    },
                    footer_sign_right: {
                        name: 'Chân trang - bên phải',
                        type: 'textarea',
                    }
                }
            },
            contact: {
                title: 'Thông tin liên hệ',
                fields: {
                    footer_address: {
                        name: 'Địa chỉ',
                        type: 'text',
                    },
                    footer_phone: {
                        name: 'Số điện thoại',
                        type: 'text'
                    },
                    footer_email: {
                        name: 'Email',
                        type: 'text'
                    },
                    fb: {
                        name: 'Facebook',
                        desc: 'Liên kết đến trang Facebook',
                        type: 'text'
                    },
                    gg: {
                        name: 'Google +',
                        desc: 'Liên kết đến Google Plus',
                        type: 'text'
                    },
                    yt: {
                        name: 'Youtube',
                        desc: 'Liên kết đến Youtube',
                        type: 'text'
                    },
                    map: {
                        name: 'Google Map Embed',
                        desc: 'Chèn mã Google Map của bạn ở đây',
                        type: 'textarea'
                    }
                }
            }
        }
    },
    products: {
        title: 'Trang sản phẩm',
        icon: 'fa fa-shopping-cart',
        fieldGroups: {
            gallery: {
                title: 'Trang sản phẩm',
                fields: {
                    product_gallery: {
                        name: 'Ảnh bìa',
                        type: 'galleryId',
                        query: 'gallery'
                    }
                }
            }
        }
    },
    blog: {
        title: 'Trang Blog',
        icon: 'fa fa-files-o',
        fieldGroups: {
            gallery: {
                title: 'Trang Blog',
                fields: {
                    blog_gallery: {
                        name: 'Ảnh bìa',
                        type: 'galleryId',
                        query: 'gallery'
                    }
                }
            }
        }
    }
};