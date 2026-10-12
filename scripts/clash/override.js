// 全局覆写脚本（JS）：对最终配置做任意转换。
// 约定：function main(config, profileName) { return config }
function main(config, profileName) {
    if (!config.proxies) return config;
    overwriteRules(config);
    overwriteProxyGroups(config);
    overwriteDns(config);
    return config;
}

const proxyMode = "代理模式";

//覆写规则
function overwriteRules(params) {
    const rules = [
        "RULE-SET,reject,广告拦截",
        "RULE-SET,ai,Ai",
        "RULE-SET,oproxy," + proxyMode,
        "RULE-SET,odirect,DIRECT",
        "RULE-SET,direct,DIRECT",
        "RULE-SET,steamcn,DIRECT",
        "RULE-SET,icloud,DIRECT",
        "RULE-SET,apple,DIRECT",
        "RULE-SET,telegram," + proxyMode,
        "RULE-SET,microsoft," + proxyMode,
        "RULE-SET,google," + proxyMode,
        "RULE-SET,icloud," + proxyMode,
        "RULE-SET,apple," + proxyMode,
        "RULE-SET,developer," + proxyMode,
        "RULE-SET,proxy," + proxyMode,
        "GEOIP,LAN,DIRECT,no-resolve",
        "GEOIP,CN,DIRECT,no-resolve",
        "MATCH,漏网之鱼",
    ];
    const ruleProviders = {
        reject: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Advertising/Advertising.yaml",
            path: "./ruleset/Advertising.yaml",
            interval: 86400,
        },
        "ai": {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/ilinuxio/SomeRulesAndScripts/main/roles/closed-ai.txt",
            path: "./ruleset/closed-ai.yaml",
            interval: 86400,
        },
        "steam": {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Steam/Steam.yaml",
            path: "./ruleset/steam.yaml",
            interval: 86400,
        },
        "steamcn": {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/SteamCN/SteamCN.yaml",
            path: "./ruleset/steam-cn.yaml",
            interval: 86400,
        },
        telegram: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Telegram/Telegram.yaml",
            path: "./ruleset/telegram.yaml",
            interval: 86400,
        },
        microsoft: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Microsoft/Microsoft.yaml",
            path: "./ruleset/microsoft.yaml",
            interval: 86400,
        },
        google: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Google/Google.yaml",
            path: "./ruleset/google.yaml",
            interval: 86400,
        },
        icloud: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/iCloud/iCloud.yaml",
            path: "./ruleset/icloud.yaml",
            interval: 86400,
        },
        apple: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Apple/Apple.yaml",
            path: "./ruleset/apple.yaml",
            interval: 86400,
        },
        developer: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Developer/Developer.yaml",
            path: "./ruleset/developer.yaml",
            interval: 86400,
        },
        proxy: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Proxy/Proxy.yaml",
            path: "./ruleset/proxy.yaml",
            interval: 86400,
        },
        direct: {
            type: "http",
            behavior: "classical",
            url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Direct/Direct.yaml",
            path: "./ruleset/direct.yaml",
            interval: 86400,
        },
        oproxy: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/ilinuxio/SomeRulesAndScripts/main/roles/override.proxy.txt",
            path: "./ruleset/overiide.proxy.yaml",
            interval: 86400,
        },
        odirect: {
            type: "http",
            behavior: "domain",
            url: "https://raw.githubusercontent.com/ilinuxio/SomeRulesAndScripts/main/roles/override.direct.txt",
            path: "./ruleset/override.direct.yaml",
            interval: 86400,
        }

    };
    params["rule-providers"] = ruleProviders;
    params["rules"] = rules;
}
//覆写代理组
function overwriteProxyGroups(params) {
    // 所有代理
    const allProxies = params["proxies"].map((e) => e.name);
    // 自动选择代理组，按地区分组选延迟最低
    const autoProxyGroupRegexs = [
        { name: "HK-自动选择", regex: /香港|HK|Hong|🇭🇰/ },
        { name: "TW-自动选择", regex: /台湾|TW|Taiwan|Wan|🇨🇳|🇹🇼/ },
        { name: "SG-自动选择", regex: /新加坡|狮城|SG|Singapore|🇸🇬/ },
        { name: "JP-自动选择", regex: /日本|JP|Japan|🇯🇵/ },
        { name: "US-自动选择", regex: /美国|US|United States|America|🇺🇸/ },
    ];

    const autoProxyGroups = autoProxyGroupRegexs
        .map((item) => ({
            name: item.name,
            type: "url-test",
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
            proxies: getProxiesByRegex(params, item.regex),
            hidden: true,
        }))
        .filter((item) => item.proxies.length > 0);

    const groups = [
        {
            name: proxyMode,
            type: "select",
            url: "https://www.gstatic.com/generate_204",
            //icon: "https://fastly.jsdelivr.net/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg",
            proxies: [
                "自动选择",
                "手动选择",
                "Ai",
                "负载散列",
                "负载轮询",
                "DIRECT",
            ],
        },
        {
            name: "手动选择",
            type: "select",
            proxies: allProxies,
        },
        {
            name: "自动选择",
            type: "select",
            proxies: ["ALL-自动选择"],
        },
        {
            name: "Ai",
            type: "select",
            proxies: allProxies,
        },
        {
            name: "负载散列",
            type: "load-balance",
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            "max-failed-times": 3,
            strategy: "consistent-hashing",
            lazy: true,
            proxies: allProxies,
        },
        {
            name: "负载轮询",
            type: "load-balance",
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            "max-failed-times": 3,
            strategy: "round-robin",
            lazy: true,
            proxies: allProxies,
        },
        {
            name: "ALL-自动选择",
            type: "url-test",
            url: "https://www.gstatic.com/generate_204",
            interval: 300,
            tolerance: 50,
            proxies: allProxies,
            hidden: true,
        },
        {
            name: "漏网之鱼",
            type: "select",
            proxies: ["DIRECT", proxyMode],
        },
        {
            name: "广告拦截",
            type: "select",
            proxies: ["REJECT", "DIRECT"],
        },
    ];

    autoProxyGroups.length &&
        groups[2].proxies.unshift(...autoProxyGroups.map((item) => item.name));
    autoProxyGroups.length &&
        groups[3].proxies.unshift(...autoProxyGroups.filter(item => item.name === "SG-自动选择")
            .map(item => item.name).concat(autoProxyGroups.filter(item => item.name !== "SG-自动选择")
                .map(item => item.name)));
    groups.push(...autoProxyGroups);
    params["proxy-groups"] = groups;
}
//防止dns泄露
function overwriteDns(params) {
    const cnDnsList = [
        'https://223.5.5.5/dns-query',
        'https://114.114.114.114/dns-query'
    ];
    const trustDnsList = [
        "https://cloudflare-dns.com/dns-query",
        "https://dns.google/dns-query"
    ];
    const dnsOptions = {
        enable: true,
        "ipv6": false,
        "prefer-h3": true, // 如果DNS服务器支持DoH3会优先使用h3
        "default-nameserver": cnDnsList, // 用于解析其他DNS服务器、和节点的域名, 必须为IP, 可为加密DNS。注意这个只用来解析节点和其他的dns，其他网络请求不归他管
        nameserver: cnDnsList, // 其他网络请求都归他管

        // 这个用于覆盖上面的 nameserver
        "nameserver-policy": {
            //[combinedUrls]: notionDns,
            "geosite:cn": cnDnsList,
            "geosite:geolocation-!cn": trustDnsList,
            // 如果你有一些内网使用的DNS，应该定义在这里，多个域名用英文逗号分割
            // '+.公司域名.com, www.4399.com, +.baidu.com': '10.0.0.1'
        },
        fallback: trustDnsList,
        "fallback-filter": {
            geoip: true,
            //除了 geoip-code 配置的国家 IP, 其他的 IP 结果会被视为污染 geoip-code 配置的国家的结果会直接采用，否则将采用 fallback结果
            "geoip-code": "CN",
            //geosite 列表的内容被视为已污染，匹配到 geosite 的域名，将只使用 fallback解析，不去使用 nameserver
            geosite: ["gfw"],
            ipcidr: ["240.0.0.0/4"],
            domain: ["+.google.com", "+.facebook.com", "+.youtube.com"],
        },
    };

    // GitHub加速前缀
    const githubPrefix = "https://gh-proxy.com/";

    // GEO数据GitHub资源原始下载地址
    const rawGeoxURLs = {
        geoip:
            "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geoip-lite.dat",
        geosite:
            "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/geosite.dat",
        mmdb: "https://github.com/MetaCubeX/meta-rules-dat/releases/download/latest/country-lite.mmdb",
    };

    // 生成带有加速前缀的GEO数据资源对象
    const accelURLs = Object.fromEntries(
        Object.entries(rawGeoxURLs).map(([key, githubUrl]) => [
            key,
            `${githubPrefix}${githubUrl}`,
        ])
    );

    const otherOptions = {
        "unified-delay": true,
        "tcp-concurrent": true,
        profile: {
            "store-selected": true,
            "store-fake-ip": true,
        },
        sniffer: {
            enable: true,
            sniff: {
                TLS: {
                    ports: [443, 8443],
                },
                HTTP: {
                    ports: [80, "8080-8880"],
                    "override-destination": true,
                },
            },
        },
        "geodata-mode": true,
        "geox-url": accelURLs,
    };

    params.dns = { ...params.dns, ...dnsOptions };
    Object.keys(otherOptions).forEach((key) => {
        params[key] = otherOptions[key];
    });
}

function getProxiesByRegex(params, regex) {
    return params.proxies.filter((e) => regex.test(e.name)).map((e) => e.name);
}