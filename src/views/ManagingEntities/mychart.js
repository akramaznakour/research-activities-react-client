import React, { Component } from "react";
import OrgChart from "@balkangraph/orgchart.js";
import "../../assets/css/orgChart.css";

export default class extends Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  shouldComponentUpdate() {
    return false;
  }
  user = localStorage.getItem("user");
  pdf(nodeId) {
    // this.chart.exportPDF({
    //     format: "A4",
    //     header: 'My Header',
    //     footer: 'My Footer. Page {current-page} of {total-pages}'
    // });
  }
  componentDidMount() {
    var printIcon = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAvVBMVEX///+QyvlhYWFCQkIZdtJCpfUkJCRSUlIsLCxeWlckIiHp9P6Ix/mRzPyFrM0mKzF2teqZzvnS6fx3te4JcdDc3Nw/OzhmhJxVnOMzhNgA5nY8PDxoaGh5eXk0NDRaWlojHBO5ubkxZI/JyclIkd4getTu7u4A7HeFhYXHx8f2+v6nv9QxLSnX19dtf4+np6djW2BWdpKRkZGCnLNWd2RMiGcT2HRlVWAd0HJbamJYd2ReY2ErwXAK33UxuW6syaGpAAADsElEQVR4nO3d71/SQBzAcRrWlmWppRaDIVIbKMhEUhPp//+zkp8yXhzcdsDdjc/n4R7o9+1t7NAahQIRERERERER7WvXn3R1vSPh6Wddne5M+E5PCBEiRIgQIUKECBEiRIgQIUKECBEiRIgQIUKECBHaImzWJt0caRIe3UxHaG5F6HjBqNaFNuFFazyC52xFWPaLo841Cs/HI/hlhAgRIkSIECFChOuFutqSMGzXR5Wrk26/6Op2OkJ5PFI7VOc1u47rjr+qM+ujrt5GGI/kuk5X6Y1U2EnAjOx1wk7mlawZzxtXrdayARuu7tGlcxsZfKFjxwKOqzqpz9TQJt+walqi7oEzlA7YsG0JXxcx1bVYt+dF5i23nu9zdJg8sGbfOTosxW1R96iZkwWeWXIVxosH3DNJYceGkzSOe396cRJZ7UgKK5qGTlPce4ii6KGXJFYkhZqGTlPci0rDogWiHDC04DJ8fCqNe3qcP+zKbd1sEP6NJsKoP39YUmjDS+nzTPg8f1jyxdQGYb80LXE4R8LHl8krzUvyOsyP0OkPhsRokLgMcyV0nH+D0uDfwrF8CeO4Hy/u2/IlXBZChOaHEKH5IURofggRmh9ChOaHEKH5IURofpLCdtG1tWJbTugVbc2TFAa6B81cgHBfhGcWX4eSdwuE5oYQofkhRGh+CBGaH0KEwwJPd6ve26kLgw8mJDYqCz3dtkniARWFsxU81NV0ANEqKgr92Tf4qqvZj9jfinC6hJdX73V1dbl6ERWFnkFC0YgI912Y/+uwaJBQMKGqcHK70C8U3SzU9zTBoRHCQ+G2TX1f6nsGCD3RCm7o3ZPvt+6OdXXX8sW8TQmNeIoSQoQIrReGFgvl/h/w9Zq/4xssDCQ/bNa1VujKAQuNlXdVsfDbZjtOLfRlH8LTXH2aCoXfN9uvk7TCQPrpdKtfaoTCg82WXujJAtecpsYKpU/SdfcLY4WS94pR3VVXoqnCoCsPLBSsXMM0wJU7N0OFkju2WU0xcUfClHcLL/VzTGui32eZeT/0Mjzgsx4I7hlC4WY/umTJVxMK/SDN8/ZmheXlZ6p5+1KvnPUptE132e+1DBP6nqvyKOFmxfcCP5lW4cIsgedXlD9zpl3rNiqJ7rUJ75ODNLo1uX/YnbbcfhoSwn0QKjwx3w7hD5WsEKps0Q6sEKrss38jRIgQIcI9Ef5UyQrhiUpWCLceQoQIESJEiBAhQoTzQrU9tsLufFdCIiIiIiIiIiIiIiKibfQf2HasYKmOKzcAAAAASUVORK5CYII=">'
    let that = this;
    OrgChart.templates.diva.field_1 = '<text  style="font-size: 14px;"  x="102" y="144" text-anchor="middle">{val}</text>';
    OrgChart.templates.group.field_0 = '<text  style="font-size: 24px;"  x="70" y="35" >{val}</text>';
    OrgChart.templates.group.link = '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}" />';
    OrgChart.templates.group.min = Object.assign({}, OrgChart.templates.group);
    OrgChart.templates.group.min.imgs = "{val}";
    OrgChart.templates.group.min.description = '<text width="230" text-overflow="multiline" style="font-size: 14px;" fill="#aeaeae" x="125" y="100" text-anchor="middle">{val}</text>';
    OrgChart.templates.diva.plus = "";
    OrgChart.templates.diva.minus = "";
    OrgChart.templates.diva.exportMenuButton = '<div style="position:absolute;right:{p}px;top:{p}px; width:40px;height:50px;cursor:pointer" control-export-menu=""  >' + printIcon + "</div>";
    this.chart = new OrgChart(this.divRef.current, {
      layout: OrgChart.tree,
      nodes: this.props.nodes,
      scaleInitial: OrgChart.match.boundary,
      nodeMouseClick: OrgChart.action.expandCollapse,
      template: "diva",
      enableSearch: false,
      mouseScrool: OrgChart.action.none,
      sticky: false,
      nodeBinding: {
        imgs: function (sender, node) {
          if (node.min) {
            var val = "";
            var count = node.stChildrenIds.length > 5 ? 5 : node.stChildrenIds.length;
            var x = node.w / 2 - (count * 32) / 2;

            for (var i = 0; i < count; i++) {
              var data = sender.get(node.stChildrenIds[i]);
              val += '<image xlink:href="' + data.img + '" x="' + (x + i * 32) + '" y="45" width="32" height="32" ></image>';
            }
            return val;
          }
        },
        field_0: "name",
        field_1: "title",
        description: "description",
        img_0: "img",
      },
      menu: {
        pdfWithTitle: {
          text: "Imprimer l'arborescence",
          icon: OrgChart.icon.pdf(24, 24),
          onClick: function () {
            this.exportPDF({
              filename: `${that.props.fileName}.pdf`,
              header: that.props.name,
              footer: "",
              format: "A4",
              margin: [60, 20, 60, 20],
            });
          },
        },
      },
      tags: {
        group: {
          template: "group",
        },
        "members-group": {
          subTreeConfig: {
            columns: 3,
          },
        },
      },
    });
   
  }

  render() {
    return <div id="tree" ref={this.divRef}></div>;
  }
}
