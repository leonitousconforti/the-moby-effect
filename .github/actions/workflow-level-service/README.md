# Notes

Actions workers are running behind the following type of NAT, according to STUN client:
<br>
<br>
`Independent Mapping, Port Dependent Filter, random port, will hairpin`
<br>
<br>
How does this matter to us?

* Independent Mapping — read it as "NAT mapping independent of destination host/port".

    The NAT would map any request to the same mapped port coming from the same local port, regardless of destination IP address or destination port. In other words, requests from 192.168.0.10:5555 to 1.1.1.1:80 would be mapped to the same NAT external address and port as the requests from 192.168.0.10:5555 to 8.8.8.8:443

* Random port — read it as "non-source-port-preserving NAT"

    Some type of NATs preserve the source port for NAT mapping wherever possible, i.e. 192.168.0.10:5555 would be mapped to 198.51.100.123:5555 (both source ports are 5555). However, Actions infrastructure NAT does not preserve the port, meaning that the source port will be mapped to another port. In Actions case, the mapping is done in sequence, starting from port 1024 or 1984 (yes, really). For example, if you send the request from 192.168.0.10:5555 to 1.1.1.1:80, your 192.168.0.10:5555 would be mapped to 198.51.100.123:1024. The next request from 192.168.0.10:9876 to 1.1.1.1:80 would be mapped to 198.51.100.123:1025, and so on. The exact pattern of port mapping is not relevant for NAT traversal as long as it is Independent Mapping, it is only important that the port is not preserved, which forces us to determine the mapping using external services like STUN server. If it were port-preserving, there wouldn't be any need to determine port mapping.

* Port Dependent Filter — read it as "NAT allows incoming packets only from single IP AND port"

    This type of NAT, when the packet is sent from exact source IP/port to exact destination IP/port, accepts incoming packets only from this exact destination IP/port. This is the most common type of filter. If it were Independent Filter, there wouldn't be any need to send client's IP address and port to the server in the git commit message: NAT accepts incoming packets from any IP and port in such case.

* Will hairpin

    Hairpinning (NAT loopback) matters only for connectivity behind the same router and is irrelevant for internet-wide NAT traversal.

## Inspiration

Lots of inspiration from <https://github.com/ValdikSS/nat-traversal-github-actions-openvpn-wireguard>
and lots of documentation from <https://tailscale.com/blog/how-nat-traversal-works>
