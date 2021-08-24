var config = {
    "gp_url": "../../../api/v2",
    "collection": "p92_urheilujournalismi_c0_data",
    "pagetitle": "Urheilujournalismi",
    "pageinfo": "",
    "item_table": {
        "display": "#items",
        "headers": [
            "teema",
            "työ",
            "tyyppi"
        ],
        "rows": [
            {
                "key": "teema"
            },
            {
                "key": "työ"
            },
            {
                "key": "tyyppi"
            }
        ]
    },
    "filters": [
        {
            "mode": "facet",
            "key": "tyyppi",
            "collapse": "collapse",
            "display": ".sidebar-left .filters",
            "title": "Tyypit"
        },
        {
            "mode": "facet",
            "key": "teema",
            "collapse": "collapse",
            "display": ".sidebar-left .filters",
            "title": "Teemat"
        }
    ]
}