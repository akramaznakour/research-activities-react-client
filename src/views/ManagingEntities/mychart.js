import React, { Component } from "react";
import OrgChart from "@balkangraph/orgchart.js";
import '../../assets/css/orgChart.css'

export default class extends Component {
  constructor(props) {
    super(props);
    this.divRef = React.createRef();
  }

  shouldComponentUpdate() {
    return false;
  }

  componentDidMount() {
    OrgChart.templates.diva.field_1 = '<text  style="font-size: 14px;"  x="102" y="144" text-anchor="middle">{val}</text>';
    OrgChart.templates.group.field_0 = '<text  style="font-size: 24px;"  x="70" y="35" >{val}</text>';
    OrgChart.templates.group.link = '<path stroke-linejoin="round" stroke="#aeaeae" stroke-width="1px" fill="none" d="M{xa},{ya} {xb},{yb} {xc},{yc} L{xd},{yd}" />';
    OrgChart.templates.group.min = Object.assign({}, OrgChart.templates.group);
    OrgChart.templates.group.min.imgs = "{val}";
    OrgChart.templates.group.min.description = '<text width="230" text-overflow="multiline" style="font-size: 14px;" fill="#aeaeae" x="125" y="100" text-anchor="middle">{val}</text>';
    OrgChart.templates.diva.plus = "";
    OrgChart.templates.diva.minus = "";
    
    this.chart = new OrgChart(this.divRef.current, {
layout: OrgChart.tree,
      nodes: this.props.nodes,
      scaleInitial: OrgChart.match.boundary,      nodeMouseClick: OrgChart.action.expandCollapse,
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
        pdf: { text: "Imprimer l'arborescence",
        format: "A4",
        expandChildren: true},
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
