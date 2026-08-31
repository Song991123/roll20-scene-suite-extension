/*
 * Scene Suite 10 - Sheet Helper 0.6.15
 * 제작 및 통합: @EOOOOORK
 * 시트 HTML 인식: 공개 및 커스텀 시트 호환
 * 속성 변화 알림 참고: https://github.com/kibkibe/roll20-api-scripts/tree/master/attribute_tracker
 */

var KIBScene = KIBScene || {};
var KIBSheetHelper = KIBSheetHelper || {};
var KIBSheetContracts = KIBSheetContracts || [];

/* SCENE_SUITE_SHEET_RECOGNITION_START */
(function () {
  /*!
   * Self-contained Brotli JSON decoder bundle
   *
   * This bundle includes code from brotli.js, base64-js, and the Browserify runtime.
   *
   * MIT License
   *
   * Copyright (c) Devon Govett
   * Copyright (c) 2014 Jameson Little
   * Copyright (c) 2010 James Halliday (mail@substack.net)
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   *
   * Apache License
   * Version 2.0, January 2004
   * http://www.apache.org/licenses/
   *
   * TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION
   *
   * 1. Definitions.
   *
   * "License" shall mean the terms and conditions for use, reproduction,
   * and distribution as defined by Sections 1 through 9 of this document.
   *
   * "Licensor" shall mean the copyright owner or entity authorized by
   * the copyright owner that is granting the License.
   *
   * "Legal Entity" shall mean the union of the acting entity and all
   * other entities that control, are controlled by, or are under common
   * control with that entity. For the purposes of this definition,
   * "control" means (i) the power, direct or indirect, to cause the
   * direction or management of such entity, whether by contract or
   * otherwise, or (ii) ownership of fifty percent (50%) or more of the
   * outstanding shares, or (iii) beneficial ownership of such entity.
   *
   * "You" (or "Your") shall mean an individual or Legal Entity
   * exercising permissions granted by this License.
   *
   * "Source" form shall mean the preferred form for making modifications,
   * including but not limited to software source code, documentation
   * source, and configuration files.
   *
   * "Object" form shall mean any form resulting from mechanical
   * transformation or translation of a Source form, including but
   * not limited to compiled object code, generated documentation,
   * and conversions to other media types.
   *
   * "Work" shall mean the work of authorship, whether in Source or
   * Object form, made available under the License, as indicated by a
   * copyright notice that is included in or attached to the work
   * (an example is provided in the Appendix below).
   *
   * "Derivative Works" shall mean any work, whether in Source or Object
   * form, that is based on (or derived from) the Work and for which the
   * editorial revisions, annotations, elaborations, or other modifications
   * represent, as a whole, an original work of authorship. For the purposes
   * of this License, Derivative Works shall not include works that remain
   * separable from, or merely link (or bind by name) to the interfaces of,
   * the Work and Derivative Works thereof.
   *
   * "Contribution" shall mean any work of authorship, including
   * the original version of the Work and any modifications or additions
   * to that Work or Derivative Works thereof, that is intentionally
   * submitted to Licensor for inclusion in the Work by the copyright owner
   * or by an individual or Legal Entity authorized to submit on behalf of
   * the copyright owner. For the purposes of this definition, "submitted"
   * means any form of electronic, verbal, or written communication sent
   * to the Licensor or its representatives, including but not limited to
   * communication on electronic mailing lists, source code control systems,
   * and issue tracking systems that are managed by, or on behalf of, the
   * Licensor for the purpose of discussing and improving the Work, but
   * excluding communication that is conspicuously marked or otherwise
   * designated in writing by the copyright owner as "Not a Contribution."
   *
   * "Contributor" shall mean Licensor and any individual or Legal Entity
   * on behalf of whom a Contribution has been received by Licensor and
   * subsequently incorporated within the Work.
   *
   * 2. Grant of Copyright License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * copyright license to reproduce, prepare Derivative Works of,
   * publicly display, publicly perform, sublicense, and distribute the
   * Work and such Derivative Works in Source or Object form.
   *
   * 3. Grant of Patent License. Subject to the terms and conditions of
   * this License, each Contributor hereby grants to You a perpetual,
   * worldwide, non-exclusive, no-charge, royalty-free, irrevocable
   * (except as stated in this section) patent license to make, have made,
   * use, offer to sell, sell, import, and otherwise transfer the Work,
   * where such license applies only to those patent claims licensable
   * by such Contributor that are necessarily infringed by their
   * Contribution(s) alone or by combination of their Contribution(s)
   * with the Work to which such Contribution(s) was submitted. If You
   * institute patent litigation against any entity (including a
   * cross-claim or counterclaim in a lawsuit) alleging that the Work
   * or a Contribution incorporated within the Work constitutes direct
   * or contributory patent infringement, then any patent licenses
   * granted to You under this License for that Work shall terminate
   * as of the date such litigation is filed.
   *
   * 4. Redistribution. You may reproduce and distribute copies of the
   * Work or Derivative Works thereof in any medium, with or without
   * modifications, and in Source or Object form, provided that You
   * meet the following conditions:
   *
   * (a) You must give any other recipients of the Work or
   * Derivative Works a copy of this License; and
   *
   * (b) You must cause any modified files to carry prominent notices
   * stating that You changed the files; and
   *
   * (c) You must retain, in the Source form of any Derivative Works
   * that You distribute, all copyright, patent, trademark, and
   * attribution notices from the Source form of the Work,
   * excluding those notices that do not pertain to any part of
   * the Derivative Works; and
   *
   * (d) If the Work includes a "NOTICE" text file as part of its
   * distribution, then any Derivative Works that You distribute must
   * include a readable copy of the attribution notices contained
   * within such NOTICE file, excluding those notices that do not
   * pertain to any part of the Derivative Works, in at least one
   * of the following places: within a NOTICE text file distributed
   * as part of the Derivative Works; within the Source form or
   * documentation, if provided along with the Derivative Works; or,
   * within a display generated by the Derivative Works, if and
   * wherever such third-party notices normally appear. The contents
   * of the NOTICE file are for informational purposes only and
   * do not modify the License. You may add Your own attribution
   * notices within Derivative Works that You distribute, alongside
   * or as an addendum to the NOTICE text from the Work, provided
   * that such additional attribution notices cannot be construed
   * as modifying the License.
   *
   * You may add Your own copyright statement to Your modifications and
   * may provide additional or different license terms and conditions
   * for use, reproduction, or distribution of Your modifications, or
   * for any such Derivative Works as a whole, provided Your use,
   * reproduction, and distribution of the Work otherwise complies with
   * the conditions stated in this License.
   *
   * 5. Submission of Contributions. Unless You explicitly state otherwise,
   * any Contribution intentionally submitted for inclusion in the Work
   * by You to the Licensor shall be under the terms and conditions of
   * this License, without any additional terms or conditions.
   * Notwithstanding the above, nothing herein shall supersede or modify
   * the terms of any separate license agreement you may have executed
   * with Licensor regarding such Contributions.
   *
   * 6. Trademarks. This License does not grant permission to use the trade
   * names, trademarks, service marks, or product names of the Licensor,
   * except as required for reasonable and customary use in describing the
   * origin of the Work and reproducing the content of the NOTICE file.
   *
   * 7. Disclaimer of Warranty. Unless required by applicable law or
   * agreed to in writing, Licensor provides the Work (and each
   * Contributor provides its Contributions) on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
   * implied, including, without limitation, any warranties or conditions
   * of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
   * PARTICULAR PURPOSE. You are solely responsible for determining the
   * appropriateness of using or redistributing the Work and assume any
   * risks associated with Your exercise of permissions under this License.
   *
   * 8. Limitation of Liability. In no event and under no legal theory,
   * whether in tort (including negligence), contract, or otherwise,
   * unless required by applicable law (such as deliberate and grossly
   * negligent acts) or agreed to in writing, shall any Contributor be
   * liable to You for damages, including any direct, indirect, special,
   * incidental, or consequential damages of any character arising as a
   * result of this License or out of the use or inability to use the
   * Work (including but not limited to damages for loss of goodwill,
   * work stoppage, computer failure or malfunction, or any and all
   * other commercial damages or losses), even if such Contributor
   * has been advised of the possibility of such damages.
   *
   * 9. Accepting Warranty or Additional Liability. While redistributing
   * the Work or Derivative Works thereof, You may choose to offer,
   * and charge a fee for, acceptance of support, warranty, indemnity,
   * or other liability obligations and/or rights consistent with this
   * License. However, in accepting such obligations, You may act only
   * on Your own behalf and on Your sole responsibility, not on behalf
   * of any other Contributor, and only if You agree to indemnify,
   * defend, and hold each Contributor harmless for any liability
   * incurred by, or claims asserted against, such Contributor by reason
   * of your accepting any such warranty or additional liability.
   *
   * END OF TERMS AND CONDITIONS
   *
   * APPENDIX: How to apply the Apache License to your work.
   *
   * To apply the Apache License to your work, attach the following
   * boilerplate notice, with the fields enclosed by brackets "[]"
   * replaced with your own identifying information. (Don't include
   * the brackets!)  The text should be enclosed in the appropriate
   * comment syntax for the file format. We also recommend that a
   * file or class name and description of purpose be included on the
   * same "printed page" as the copyright notice for easier
   * identification within third-party archives.
   *
   * Copyright 2013 Google Inc. All Rights Reserved.
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */
  var DecodeBrotliJson = (function () {
    var self = {};
    (function (module, exports, define, window, global) {
      !function(e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).DecodeBrotliJson=e()}(function(){return function e(n,t,r){function i(s,f){if(!t[s]){if(!n[s]){var a="function"==typeof require&&require;if(!f&&a)return a(s,!0);if(o)return o(s,!0);var w=new Error("Cannot find module '"+s+"'");throw w.code="MODULE_NOT_FOUND",w}var d=t[s]={exports:{}};n[s][0].call(d.exports,function(e){return i(n[s][1][e]||e)},d,d.exports,e,n,t,r)}return t[s].exports}for(var o="function"==typeof require&&require,s=0;s<r.length;s++)i(r[s]);return i}({1:[function(e,n,t){var r=e("brotli/decompress"),i=e("base64-js").toByteArray;n.exports=function(e){for(var n=r(i(e)),t=[],o=[],s=0;s<n.length;s+=1)o.push(n[s]),8192===o.length&&(t.push(String.fromCharCode.apply(null,o)),o.length=0);return o.length&&t.push(String.fromCharCode.apply(null,o)),t.join("")}},{"base64-js":2,"brotli/decompress":13}],2:[function(e,n,t){"use strict";t.byteLength=function(e){var n=a(e),t=n[0],r=n[1];return 3*(t+r)/4-r},t.toByteArray=function(e){var n,t,r=a(e),s=r[0],f=r[1],w=new o(function(e,n,t){return 3*(n+t)/4-t}(0,s,f)),d=0,u=f>0?s-4:s;for(t=0;t<u;t+=4)n=i[e.charCodeAt(t)]<<18|i[e.charCodeAt(t+1)]<<12|i[e.charCodeAt(t+2)]<<6|i[e.charCodeAt(t+3)],w[d++]=n>>16&255,w[d++]=n>>8&255,w[d++]=255&n;return 2===f&&(n=i[e.charCodeAt(t)]<<2|i[e.charCodeAt(t+1)]>>4,w[d++]=255&n),1===f&&(n=i[e.charCodeAt(t)]<<10|i[e.charCodeAt(t+1)]<<4|i[e.charCodeAt(t+2)]>>2,w[d++]=n>>8&255,w[d++]=255&n),w},t.fromByteArray=function(e){for(var n,t=e.length,i=t%3,o=[],s=16383,f=0,a=t-i;f<a;f+=s)o.push(d(e,f,f+s>a?a:f+s));return 1===i?(n=e[t-1],o.push(r[n>>2]+r[n<<4&63]+"==")):2===i&&(n=(e[t-2]<<8)+e[t-1],o.push(r[n>>10]+r[n>>4&63]+r[n<<2&63]+"=")),o.join("")};for(var r=[],i=[],o="undefined"!=typeof Uint8Array?Uint8Array:Array,s="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",f=0;f<64;++f)r[f]=s[f],i[s.charCodeAt(f)]=f;function a(e){var n=e.length;if(n%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var t=e.indexOf("=");return-1===t&&(t=n),[t,t===n?0:4-t%4]}function w(e){return r[e>>18&63]+r[e>>12&63]+r[e>>6&63]+r[63&e]}function d(e,n,t){for(var r,i=[],o=n;o<t;o+=3)r=(e[o]<<16&16711680)+(e[o+1]<<8&65280)+(255&e[o+2]),i.push(w(r));return i.join("")}i["-".charCodeAt(0)]=62,i["_".charCodeAt(0)]=63},{}],3:[function(e,n,t){var r=4096,i=new Uint32Array([0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535,131071,262143,524287,1048575,2097151,4194303,8388607,16777215]);function o(e){this.buf_=new Uint8Array(8224),this.input_=e,this.reset()}o.READ_SIZE=r,o.IBUF_MASK=8191,o.prototype.reset=function(){this.buf_ptr_=0,this.val_=0,this.pos_=0,this.bit_pos_=0,this.bit_end_pos_=0,this.eos_=0,this.readMoreInput();for(var e=0;e<4;e++)this.val_|=this.buf_[this.pos_]<<8*e,++this.pos_;return this.bit_end_pos_>0},o.prototype.readMoreInput=function(){if(!(this.bit_end_pos_>256))if(this.eos_){if(this.bit_pos_>this.bit_end_pos_)throw new Error("Unexpected end of input "+this.bit_pos_+" "+this.bit_end_pos_)}else{var e=this.buf_ptr_,n=this.input_.read(this.buf_,e,r);if(n<0)throw new Error("Unexpected end of input");if(n<r){this.eos_=1;for(var t=0;t<32;t++)this.buf_[e+n+t]=0}if(0===e){for(t=0;t<32;t++)this.buf_[8192+t]=this.buf_[t];this.buf_ptr_=r}else this.buf_ptr_=0;this.bit_end_pos_+=n<<3}},o.prototype.fillBitWindow=function(){for(;this.bit_pos_>=8;)this.val_>>>=8,this.val_|=this.buf_[8191&this.pos_]<<24,++this.pos_,this.bit_pos_=this.bit_pos_-8>>>0,this.bit_end_pos_=this.bit_end_pos_-8>>>0},o.prototype.readBits=function(e){32-this.bit_pos_<e&&this.fillBitWindow();var n=this.val_>>>this.bit_pos_&i[e];return this.bit_pos_+=e,n},n.exports=o},{}],4:[function(e,n,t){t.lookup=new Uint8Array([0,0,0,0,0,0,0,0,0,4,4,0,0,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,8,12,16,12,12,20,12,16,24,28,12,12,32,12,36,12,44,44,44,44,44,44,44,44,44,44,32,32,24,40,28,12,12,48,52,52,52,48,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,48,52,52,52,52,52,24,12,28,12,12,12,56,60,60,60,56,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,56,60,60,60,60,60,24,12,28,12,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,2,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,0,8,8,8,8,8,8,8,8,8,8,8,8,8,8,8,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,16,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,24,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,32,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,40,48,48,48,48,48,48,48,48,48,48,48,48,48,48,48,56,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,11,11,11,11,12,12,12,12,13,13,13,13,14,14,14,14,15,15,15,15,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,22,22,22,22,23,23,23,23,24,24,24,24,25,25,25,25,26,26,26,26,27,27,27,27,28,28,28,28,29,29,29,29,30,30,30,30,31,31,31,31,32,32,32,32,33,33,33,33,34,34,34,34,35,35,35,35,36,36,36,36,37,37,37,37,38,38,38,38,39,39,39,39,40,40,40,40,41,41,41,41,42,42,42,42,43,43,43,43,44,44,44,44,45,45,45,45,46,46,46,46,47,47,47,47,48,48,48,48,49,49,49,49,50,50,50,50,51,51,51,51,52,52,52,52,53,53,53,53,54,54,54,54,55,55,55,55,56,56,56,56,57,57,57,57,58,58,58,58,59,59,59,59,60,60,60,60,61,61,61,61,62,62,62,62,63,63,63,63,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]),t.lookupOffsets=new Uint16Array([1024,1536,1280,1536,0,256,768,512])},{}],5:[function(e,n,t){var r=e("./streams").BrotliInput,i=e("./streams").BrotliOutput,o=e("./bit_reader"),s=e("./dictionary"),f=e("./huffman").HuffmanCode,a=e("./huffman").BrotliBuildHuffmanTable,w=e("./context"),d=e("./prefix"),u=e("./transform"),p=1080,h=new Uint8Array([1,2,3,4,0,5,17,6,16,7,8,9,10,11,12,13,14,15]),c=new Uint8Array([3,2,1,0,3,3,3,3,3,3,2,2,2,2,2,2]),b=new Int8Array([0,0,0,0,-1,1,-2,2,-3,3,-1,1,-2,2,-3,3]),l=new Uint16Array([256,402,436,468,500,534,566,598,630,662,694,726,758,790,822,854,886,920,952,984,1016,1048,1080]);function v(e){var n;return 0===e.readBits(1)?16:(n=e.readBits(3))>0?17+n:(n=e.readBits(3))>0?8+n:17}function y(e){if(e.readBits(1)){var n=e.readBits(3);return 0===n?1:e.readBits(n)+(1<<n)}return 0}function m(){this.meta_block_length=0,this.input_end=0,this.is_uncompressed=0,this.is_metadata=!1}function W(e){var n,t,r,i=new m;if(i.input_end=e.readBits(1),i.input_end&&e.readBits(1))return i;if(7===(n=e.readBits(2)+4)){if(i.is_metadata=!0,0!==e.readBits(1))throw new Error("Invalid reserved bit");if(0===(t=e.readBits(2)))return i;for(r=0;r<t;r++){var o=e.readBits(8);if(r+1===t&&t>1&&0===o)throw new Error("Invalid size byte");i.meta_block_length|=o<<8*r}}else for(r=0;r<n;++r){var s=e.readBits(4);if(r+1===n&&n>4&&0===s)throw new Error("Invalid size nibble");i.meta_block_length|=s<<4*r}return++i.meta_block_length,i.input_end||i.is_metadata||(i.is_uncompressed=e.readBits(1)),i}function x(e,n,t){var r;return t.fillBitWindow(),(r=e[n+=t.val_>>>t.bit_pos_&255].bits-8)>0&&(t.bit_pos_+=8,n+=e[n].value,n+=t.val_>>>t.bit_pos_&(1<<r)-1),t.bit_pos_+=e[n].bits,e[n].value}function U(e,n,t,r){var i,o,s=new Uint8Array(e);if(r.readMoreInput(),1===(o=r.readBits(2))){for(var w=e-1,d=0,u=new Int32Array(4),p=r.readBits(2)+1;w;)w>>=1,++d;for(c=0;c<p;++c)u[c]=r.readBits(d)%e,s[u[c]]=2;switch(s[u[0]]=1,p){case 1:break;case 3:if(u[0]===u[1]||u[0]===u[2]||u[1]===u[2])throw new Error("[ReadHuffmanCode] invalid symbols");break;case 2:if(u[0]===u[1])throw new Error("[ReadHuffmanCode] invalid symbols");s[u[1]]=1;break;case 4:if(u[0]===u[1]||u[0]===u[2]||u[0]===u[3]||u[1]===u[2]||u[1]===u[3]||u[2]===u[3])throw new Error("[ReadHuffmanCode] invalid symbols");r.readBits(1)?(s[u[2]]=3,s[u[3]]=3):s[u[0]]=2}}else{var c,b=new Uint8Array(18),l=32,v=0,y=[new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,1),new f(2,0),new f(2,4),new f(2,3),new f(3,2),new f(2,0),new f(2,4),new f(2,3),new f(4,5)];for(c=o;c<18&&l>0;++c){var m,W=h[c],x=0;r.fillBitWindow(),x+=r.val_>>>r.bit_pos_&15,r.bit_pos_+=y[x].bits,m=y[x].value,b[W]=m,0!==m&&(l-=32>>m,++v)}if(1!==v&&0!==l)throw new Error("[ReadHuffmanCode] invalid num_codes or space");!function(e,n,t,r){for(var i=0,o=8,s=0,w=0,d=32768,u=[],p=0;p<32;p++)u.push(new f(0,0));for(a(u,0,5,e,18);i<n&&d>0;){var h,c=0;if(r.readMoreInput(),r.fillBitWindow(),c+=r.val_>>>r.bit_pos_&31,r.bit_pos_+=u[c].bits,(h=255&u[c].value)<16)s=0,t[i++]=h,0!==h&&(o=h,d-=32768>>h);else{var b,l,v=h-14,y=0;if(16===h&&(y=o),w!==y&&(s=0,w=y),b=s,s>0&&(s-=2,s<<=v),i+(l=(s+=r.readBits(v)+3)-b)>n)throw new Error("[ReadHuffmanCodeLengths] symbol + repeat_delta > num_symbols");for(var m=0;m<l;m++)t[i+m]=w;i+=l,0!==w&&(d-=l<<15-w)}}if(0!==d)throw new Error("[ReadHuffmanCodeLengths] space = "+d);for(;i<n;i++)t[i]=0}(b,e,s,r)}if(0===(i=a(n,t,8,s,e)))throw new Error("[ReadHuffmanCode] BuildHuffmanTable failed: ");return i}function E(e,n,t){var r,i;return r=x(e,n,t),i=d.kBlockLengthPrefixCode[r].nbits,d.kBlockLengthPrefixCode[r].offset+t.readBits(i)}function V(e,n,t){var r;return e<16?(t+=c[e],r=n[t&=3]+b[e]):r=e-16+1,r}function O(e,n){for(var t=e[n],r=n;r;--r)e[r]=e[r-1];e[0]=t}function N(e,n){this.alphabet_size=e,this.num_htrees=n,this.codes=new Array(n+n*l[e+31>>>5]),this.htrees=new Uint32Array(n)}function q(e,n){var t,r,i={num_htrees:null,context_map:null},o=0;n.readMoreInput();var s=i.num_htrees=y(n)+1,a=i.context_map=new Uint8Array(e);if(s<=1)return i;for(n.readBits(1)&&(o=n.readBits(4)+1),t=[],r=0;r<p;r++)t[r]=new f(0,0);for(U(s+o,t,0,n),r=0;r<e;){var w;if(n.readMoreInput(),0===(w=x(t,0,n)))a[r]=0,++r;else if(w<=o)for(var d=1+(1<<w)+n.readBits(w);--d;){if(r>=e)throw new Error("[DecodeContextMap] i >= context_map_size");a[r]=0,++r}else a[r]=w-o,++r}return n.readBits(1)&&function(e,n){var t,r=new Uint8Array(256);for(t=0;t<256;++t)r[t]=t;for(t=0;t<n;++t){var i=e[t];e[t]=r[i],i&&O(r,i)}}(a,e),i}function B(e,n,t,r,i,o,s){var f,a=2*t,w=t,d=x(n,t*p,s);(f=0===d?i[a+(1&o[w])]:1===d?i[a+(o[w]-1&1)]+1:d-2)>=e&&(f-=e),r[t]=f,i[a+(1&o[w])]=f,++o[w]}function Y(e,n,t,r,i,s){var f,a=i+1,w=t&i,d=s.pos_&o.IBUF_MASK;if(n<8||s.bit_pos_+(n<<3)<s.bit_end_pos_)for(;n-- >0;)s.readMoreInput(),r[w++]=s.readBits(8),w===a&&(e.write(r,a),w=0);else{if(s.bit_end_pos_<32)throw new Error("[CopyUncompressedBlockToOutput] br.bit_end_pos_ < 32");for(;s.bit_pos_<32;)r[w]=s.val_>>>s.bit_pos_,s.bit_pos_+=8,++w,--n;if(d+(f=s.bit_end_pos_-s.bit_pos_>>3)>o.IBUF_MASK){for(var u=o.IBUF_MASK+1-d,p=0;p<u;p++)r[w+p]=s.buf_[d+p];f-=u,w+=u,n-=u,d=0}for(p=0;p<f;p++)r[w+p]=s.buf_[d+p];if(n-=f,(w+=f)>=a)for(e.write(r,a),w-=a,p=0;p<w;p++)r[p]=r[a+p];for(;w+n>=a;){if(f=a-w,s.input_.read(r,w,f)<f)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");e.write(r,a),n-=f,w=0}if(s.input_.read(r,w,n)<n)throw new Error("[CopyUncompressedBlockToOutput] not enough bytes");s.reset()}}function R(e){var n=e.bit_pos_+7&-8;return 0==e.readBits(n-e.bit_pos_)}function H(e){var n=new r(e),t=new o(n);return v(t),W(t).meta_block_length}function M(e,n){var t,r,i,a,h,c,b,l,m,O,H=0,M=0,g=0,A=[16,15,11,4],F=0,Z=0,P=0,k=[new N(0,0),new N(0,0),new N(0,0)],K=128+o.READ_SIZE;i=(1<<(r=v(O=new o(e))))-16,h=(a=1<<r)-1,c=new Uint8Array(a+K+s.maxDictionaryWordLength),b=a,l=[],m=[];for(var X=0;X<3240;X++)l[X]=new f(0,0),m[X]=new f(0,0);for(;!M;){var G,L,J,T,z,D,I,j,C,Q,S,_=0,$=[1<<28,1<<28,1<<28],ee=[0],ne=[1,1,1],te=[0,1,0,1,0,1],re=[0],ie=null,oe=null,se=0,fe=null,ae=0,we=0,de=0;for(t=0;t<3;++t)k[t].codes=null,k[t].htrees=null;O.readMoreInput();var ue=W(O);if(H+(_=ue.meta_block_length)>n.buffer.length){var pe=new Uint8Array(H+_);pe.set(n.buffer),n.buffer=pe}if(M=ue.input_end,G=ue.is_uncompressed,ue.is_metadata)for(R(O);_>0;--_)O.readMoreInput(),O.readBits(8);else if(0!==_)if(G)O.bit_pos_=O.bit_pos_+7&-8,Y(n,_,H,c,h,O),H+=_;else{for(t=0;t<3;++t)ne[t]=y(O)+1,ne[t]>=2&&(U(ne[t]+2,l,t*p,O),U(26,m,t*p,O),$[t]=E(m,t*p,O),re[t]=1);for(O.readMoreInput(),T=(1<<(L=O.readBits(2)))-1,z=(J=16+(O.readBits(4)<<L))+(48<<L),ie=new Uint8Array(ne[0]),t=0;t<ne[0];++t)O.readMoreInput(),ie[t]=O.readBits(2)<<1;var he=q(ne[0]<<6,O);I=he.num_htrees,D=he.context_map;var ce=q(ne[2]<<2,O);for(C=ce.num_htrees,j=ce.context_map,k[0]=new N(256,I),k[1]=new N(704,ne[1]),k[2]=new N(z,C),t=0;t<3;++t)k[t].decode(O);for(oe=0,fe=0,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1],S=k[1].htrees[0];_>0;){var be,le,ve,ye,me,We,xe,Ue,Ee,Ve,Oe,Ne;for(O.readMoreInput(),0===$[1]&&(B(ne[1],l,1,ee,te,re,O),$[1]=E(m,p,O),S=k[1].htrees[ee[1]]),--$[1],(le=(be=x(k[1].codes,S,O))>>6)>=2?(le-=2,xe=-1):xe=0,ve=d.kInsertRangeLut[le]+(be>>3&7),ye=d.kCopyRangeLut[le]+(7&be),me=d.kInsertLengthPrefixCode[ve].offset+O.readBits(d.kInsertLengthPrefixCode[ve].nbits),We=d.kCopyLengthPrefixCode[ye].offset+O.readBits(d.kCopyLengthPrefixCode[ye].nbits),Z=c[H-1&h],P=c[H-2&h],Ee=0;Ee<me;++Ee)O.readMoreInput(),0===$[0]&&(B(ne[0],l,0,ee,te,re,O),$[0]=E(m,0,O),oe=ee[0]<<6,Q=ie[ee[0]],we=w.lookupOffsets[Q],de=w.lookupOffsets[Q+1]),se=D[oe+(w.lookup[we+Z]|w.lookup[de+P])],--$[0],P=Z,Z=x(k[0].codes,k[0].htrees[se],O),c[H&h]=Z,(H&h)===h&&n.write(c,a),++H;if((_-=me)<=0)break;if(xe<0&&(O.readMoreInput(),0===$[2]&&(B(ne[2],l,2,ee,te,re,O),$[2]=E(m,2160,O),fe=ee[2]<<2),--$[2],ae=j[fe+(255&(We>4?3:We-2))],(xe=x(k[2].codes,k[2].htrees[ae],O))>=J&&(Ne=(xe-=J)&T,xe=J+((qe=(2+(1&(xe>>=L))<<(Oe=1+(xe>>1)))-4)+O.readBits(Oe)<<L)+Ne)),(Ue=V(xe,A,F))<0)throw new Error("[BrotliDecompress] invalid distance");if(Ve=H&h,Ue>(g=H<i&&g!==i?H:i)){if(!(We>=s.minDictionaryWordLength&&We<=s.maxDictionaryWordLength))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var qe=s.offsetsByLength[We],Be=Ue-g-1,Ye=s.sizeBitsByLength[We],Re=Be>>Ye;if(qe+=(Be&(1<<Ye)-1)*We,!(Re<u.kNumTransforms))throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);var He=u.transformDictionaryWord(c,Ve,qe,We,Re);if(H+=He,_-=He,(Ve+=He)>=b){n.write(c,a);for(var Me=0;Me<Ve-b;Me++)c[Me]=c[b+Me]}}else{if(xe>0&&(A[3&F]=Ue,++F),We>_)throw new Error("Invalid backward reference. pos: "+H+" distance: "+Ue+" len: "+We+" bytes left: "+_);for(Ee=0;Ee<We;++Ee)c[H&h]=c[H-Ue&h],(H&h)===h&&n.write(c,a),++H,--_}Z=c[H-1&h],P=c[H-2&h]}H&=1073741823}}n.write(c,H&h)}N.prototype.decode=function(e){var n,t=0;for(n=0;n<this.num_htrees;++n)this.htrees[n]=t,t+=U(this.alphabet_size,this.codes,t,e)},t.BrotliDecompressedSize=H,t.BrotliDecompressBuffer=function(e,n){var t=new r(e);null==n&&(n=H(e));var o=new Uint8Array(n),s=new i(o);return M(t,s),s.pos<s.buffer.length&&(s.buffer=s.buffer.subarray(0,s.pos)),s.buffer},t.BrotliDecompress=M,s.init()},{"./bit_reader":3,"./context":4,"./dictionary":8,"./huffman":9,"./prefix":10,"./streams":11,"./transform":12}],6:[function(e,n,t){var r=e("base64-js");t.init=function(){return(0,e("./decode").BrotliDecompressBuffer)(r.toByteArray(e("./dictionary.bin.js")))}},{"./decode":5,"./dictionary.bin.js":7,"base64-js":2}],7:[function(e,n,t){n.exports="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"},{}],8:[function(e,n,t){var r=e("./dictionary-data");t.init=function(){t.dictionary=r.init()},t.offsetsByLength=new Uint32Array([0,0,0,0,0,4096,9216,21504,35840,44032,53248,63488,74752,87040,93696,100864,104704,106752,108928,113536,115968,118528,119872,121280,122016]),t.sizeBitsByLength=new Uint8Array([0,0,0,0,10,10,11,11,10,10,10,10,10,9,9,8,7,7,8,7,7,6,6,5,5]),t.minDictionaryWordLength=4,t.maxDictionaryWordLength=24},{"./dictionary-data":6}],9:[function(e,n,t){function r(e,n){this.bits=e,this.value=n}t.HuffmanCode=r;function i(e,n){for(var t=1<<n-1;e&t;)t>>=1;return(e&t-1)+t}function o(e,n,t,i,o){do{e[n+(i-=t)]=new r(o.bits,o.value)}while(i>0)}function s(e,n,t){for(var r=1<<n-t;n<15&&!((r-=e[n])<=0);)++n,r<<=1;return n-t}t.BrotliBuildHuffmanTable=function(e,n,t,f,a){var w,d,u,p,h,c,b,l,v,y,m=n,W=new Int32Array(16),x=new Int32Array(16);for(y=new Int32Array(a),d=0;d<a;d++)W[f[d]]++;for(x[1]=0,w=1;w<15;w++)x[w+1]=x[w]+W[w];for(d=0;d<a;d++)0!==f[d]&&(y[x[f[d]]++]=d);if(v=l=1<<(b=t),1===x[15]){for(u=0;u<v;++u)e[n+u]=new r(0,65535&y[0]);return v}for(u=0,d=0,w=1,p=2;w<=t;++w,p<<=1)for(;W[w]>0;--W[w])o(e,n+u,p,l,new r(255&w,65535&y[d++])),u=i(u,w);for(c=v-1,h=-1,w=t+1,p=2;w<=15;++w,p<<=1)for(;W[w]>0;--W[w])(u&c)!==h&&(n+=l,v+=l=1<<(b=s(W,w,t)),e[m+(h=u&c)]=new r(b+t&255,n-m-h&65535)),o(e,n+(u>>t),p,l,new r(w-t&255,65535&y[d++])),u=i(u,w);return v}},{}],10:[function(e,n,t){function r(e,n){this.offset=e,this.nbits=n}t.kBlockLengthPrefixCode=[new r(1,2),new r(5,2),new r(9,2),new r(13,2),new r(17,3),new r(25,3),new r(33,3),new r(41,3),new r(49,4),new r(65,4),new r(81,4),new r(97,4),new r(113,5),new r(145,5),new r(177,5),new r(209,5),new r(241,6),new r(305,6),new r(369,7),new r(497,8),new r(753,9),new r(1265,10),new r(2289,11),new r(4337,12),new r(8433,13),new r(16625,24)],t.kInsertLengthPrefixCode=[new r(0,0),new r(1,0),new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,1),new r(8,1),new r(10,2),new r(14,2),new r(18,3),new r(26,3),new r(34,4),new r(50,4),new r(66,5),new r(98,5),new r(130,6),new r(194,7),new r(322,8),new r(578,9),new r(1090,10),new r(2114,12),new r(6210,14),new r(22594,24)],t.kCopyLengthPrefixCode=[new r(2,0),new r(3,0),new r(4,0),new r(5,0),new r(6,0),new r(7,0),new r(8,0),new r(9,0),new r(10,1),new r(12,1),new r(14,2),new r(18,2),new r(22,3),new r(30,3),new r(38,4),new r(54,4),new r(70,5),new r(102,5),new r(134,6),new r(198,7),new r(326,8),new r(582,9),new r(1094,10),new r(2118,24)],t.kInsertRangeLut=[0,0,8,8,0,16,8,16,16],t.kCopyRangeLut=[0,8,0,8,16,0,16,8,16]},{}],11:[function(e,n,t){function r(e){this.buffer=e,this.pos=0}function i(e){this.buffer=e,this.pos=0}r.prototype.read=function(e,n,t){this.pos+t>this.buffer.length&&(t=this.buffer.length-this.pos);for(var r=0;r<t;r++)e[n+r]=this.buffer[this.pos+r];return this.pos+=t,t},t.BrotliInput=r,i.prototype.write=function(e,n){if(this.pos+n>this.buffer.length)throw new Error("Output buffer is not large enough");return this.buffer.set(e.subarray(0,n),this.pos),this.pos+=n,n},t.BrotliOutput=i},{}],12:[function(e,n,t){var r=e("./dictionary"),i=10,o=11;function s(e,n,t){this.prefix=new Uint8Array(e.length),this.transform=n,this.suffix=new Uint8Array(t.length);for(var r=0;r<e.length;r++)this.prefix[r]=e.charCodeAt(r);for(r=0;r<t.length;r++)this.suffix[r]=t.charCodeAt(r)}var f=[new s("",0,""),new s("",0," "),new s(" ",0," "),new s("",12,""),new s("",i," "),new s("",0," the "),new s(" ",0,""),new s("s ",0," "),new s("",0," of "),new s("",i,""),new s("",0," and "),new s("",13,""),new s("",1,""),new s(", ",0," "),new s("",0,", "),new s(" ",i," "),new s("",0," in "),new s("",0," to "),new s("e ",0," "),new s("",0,'"'),new s("",0,"."),new s("",0,'">'),new s("",0,"\n"),new s("",3,""),new s("",0,"]"),new s("",0," for "),new s("",14,""),new s("",2,""),new s("",0," a "),new s("",0," that "),new s(" ",i,""),new s("",0,". "),new s(".",0,""),new s(" ",0,", "),new s("",15,""),new s("",0," with "),new s("",0,"'"),new s("",0," from "),new s("",0," by "),new s("",16,""),new s("",17,""),new s(" the ",0,""),new s("",4,""),new s("",0,". The "),new s("",o,""),new s("",0," on "),new s("",0," as "),new s("",0," is "),new s("",7,""),new s("",1,"ing "),new s("",0,"\n\t"),new s("",0,":"),new s(" ",0,". "),new s("",0,"ed "),new s("",20,""),new s("",18,""),new s("",6,""),new s("",0,"("),new s("",i,", "),new s("",8,""),new s("",0," at "),new s("",0,"ly "),new s(" the ",0," of "),new s("",5,""),new s("",9,""),new s(" ",i,", "),new s("",i,'"'),new s(".",0,"("),new s("",o," "),new s("",i,'">'),new s("",0,'="'),new s(" ",0,"."),new s(".com/",0,""),new s(" the ",0," of the "),new s("",i,"'"),new s("",0,". This "),new s("",0,","),new s(".",0," "),new s("",i,"("),new s("",i,"."),new s("",0," not "),new s(" ",0,'="'),new s("",0,"er "),new s(" ",o," "),new s("",0,"al "),new s(" ",o,""),new s("",0,"='"),new s("",o,'"'),new s("",i,". "),new s(" ",0,"("),new s("",0,"ful "),new s(" ",i,". "),new s("",0,"ive "),new s("",0,"less "),new s("",o,"'"),new s("",0,"est "),new s(" ",i,"."),new s("",o,'">'),new s(" ",0,"='"),new s("",i,","),new s("",0,"ize "),new s("",o,"."),new s("Â ",0,""),new s(" ",0,","),new s("",i,'="'),new s("",o,'="'),new s("",0,"ous "),new s("",o,", "),new s("",i,"='"),new s(" ",i,","),new s(" ",o,'="'),new s(" ",o,", "),new s("",o,","),new s("",o,"("),new s("",o,". "),new s(" ",o,"."),new s("",o,"='"),new s(" ",o,". "),new s(" ",i,'="'),new s(" ",o,"='"),new s(" ",i,"='")];function a(e,n){return e[n]<192?(e[n]>=97&&e[n]<=122&&(e[n]^=32),1):e[n]<224?(e[n+1]^=32,2):(e[n+2]^=5,3)}t.kTransforms=f,t.kNumTransforms=f.length,t.transformDictionaryWord=function(e,n,t,s,w){var d,u=f[w].prefix,p=f[w].suffix,h=f[w].transform,c=h<12?0:h-11,b=0,l=n;c>s&&(c=s);for(var v=0;v<u.length;)e[n++]=u[v++];for(t+=c,s-=c,h<=9&&(s-=h),b=0;b<s;b++)e[n++]=r.dictionary[t+b];if(d=n-s,h===i)a(e,d);else if(h===o)for(;s>0;){var y=a(e,d);d+=y,s-=y}for(var m=0;m<p.length;)e[n++]=p[m++];return n-l}},{"./dictionary":8}],13:[function(e,n,t){n.exports=e("./dec/decode").BrotliDecompressBuffer},{"./dec/decode":5}]},{},[1])(1)});
    }(void 0, void 0, void 0, void 0, void 0));
    return self.DecodeBrotliJson;
  }());
  var compressed = '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';
  if (compressed.length !== 291412 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4651885) throw new Error('Invalid embedded sheet data length.');
  var bundle = JSON.parse(decoded);
  var strings = bundle.d || [];
  function expand(value) {
    if (typeof value === 'string' && value.charAt(0) === '')
      return strings[parseInt(value.substring(1), 36)];
    if (Array.isArray(value)) {
      value.forEach(function (item, index) { value[index] = expand(item); });
    } else if (value && typeof value === 'object') {
      Object.keys(value).forEach(function (key) { value[key] = expand(value[key]); });
    }
    return value;
  }
  var packed = expand(bundle.p || bundle);
  var embedded = packed.s || [];
  var sharedModeSets = packed.m || [];
  var serializedModes = sharedModeSets.map(JSON.stringify);
  var serializedRollVisibility = (packed.r || []).map(JSON.stringify);
  var serializedFieldVisibility = (packed.v || []).map(JSON.stringify);
  var serializedFieldAliases = (packed.a || []).map(JSON.stringify);
  embedded.forEach(function (sheet) {
    var modeSets = (sheet.M || []).map(function (index) { return serializedModes[index]; });
    var rollVisibilitySets = (sheet.R || []).map(function (index) { return JSON.parse(serializedRollVisibility[index]); });
    sheet.rolls = (sheet.rolls || []).map(function (roll) {
      var restored = { key: roll[0], name: roll[1] || null, label: roll[2] || '', aliases: roll[3] || [],
        raw: roll[4] || '', template: roll[5] || null, repeating: roll[7] || null,
        staticLabels: roll[8] || [], labelRefs: roll[9] || [], expressionRefs: roll[10] || [],
        modes: roll[13] ? JSON.parse(modeSets[roll[13] - 1]) : [] };
      if (roll[6]) restored.refs = roll[6];
      if (roll[11]) restored.controls = roll[11];
      if (roll[12]) restored.modesIncomplete = true;
      if (roll[14]) restored.visibility = rollVisibilitySets[roll[14] - 1];
      return restored;
    });
    delete sheet.M;
    delete sheet.R;
    var fieldVisibilitySets = (sheet.V || []).map(function (index) { return JSON.parse(serializedFieldVisibility[index]); });
    var fieldAliasSets = (sheet.A || []).map(function (index) { return JSON.parse(serializedFieldAliases[index]); });
    delete sheet.V;
    delete sheet.A;
    var fieldTypes = ['text','number','range','checkbox','radio','hidden','textarea','select'];
    var sections = Object.keys(sheet.sections || {}).sort();
    var repeatingFields = Object.create(null);
    sections.forEach(function (section) {
      (sheet.sections[section] || []).forEach(function (name) { repeatingFields[name] = true; });
    });
    var globalRepeating = sheet.g || [];
    sheet.globalAttributes = (sheet.attributes || []).filter(function (name) {
      return !repeatingFields[name] || globalRepeating.indexOf(name) >= 0;
    });
    delete sheet.g;
    sheet.fields = (sheet.f || []).map(function (field) {
      var flags = Number(field[3]) || 0;
      return { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',
        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],
        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',
        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),
        disabled: !!(flags & 8), hidden: !!(flags & 16) };
    });
    delete sheet.f;
    if (!KIBSheetContracts.some(function (current) { return current && current.id === sheet.id; }))
      KIBSheetContracts.push(sheet);
  });
}());
/* SCENE_SUITE_SHEET_RECOGNITION_END */

// ===== 사용자 설정 =====
var sheet_helper_setting = {
  enabled: true,
  legacy_commands: true,
  manager_name: '[GM] 시트 헬퍼 관리',
  player_help_name: '[PL] 시트 헬퍼 사용법',
  refresh_delay: 700,
};

(function (api) {
  'use strict';

  var SHEET_NOT_RECOGNIZED = '현재 인식된 시트가 없습니다.';

  var VERSION = '0.6.14';
  var cache = {};
  var attributeObjectCache = {};
  var refreshTimer = null;
  var pendingResults = {};
  var contractIndexCache = {};
  var contractMatchCache = {};
  var contractCatalogCache = null;
  var suppressedAttributeChanges = {};

  // ===== 공통 처리 =====
  function own(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }

  function dictionary(source) {
    var result = Object.create(null);
    Object.keys(source || {}).forEach(function (key) { result[key] = source[key]; });
    return result;
  }

  function trim(value) {
    return String(value == null ? '' : value).trim();
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

 function normalize(value) {
    return trim(value)
      .toLowerCase()
      .replace(/[\s_()（）\[\]{}\/\\.\u00b7,:：-]+/g, '');
  }

  function arithmeticValue(expression) {
    var source = trim(expression).replace(/\s+/g, '');
    var tokens = source.match(/floor|ceil|round|min|max|abs|\d+(?:\.\d+)?|[()+\-*/,]/gi) || [];
    if (!source || tokens.join('') !== source || tokens.length > 200) return null;
    var at = 0;
    function primary() {
      var token = tokens[at++];
      if (token === '+' || token === '-') {
        var unary = primary();
        return unary === null ? null : token === '-' ? -unary : unary;
      }
      if (token === '(') {
        var nested = expressionValue();
        if (tokens[at++] !== ')') return null;
        return nested;
      }
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token || '')) {
        var name = token.toLowerCase();
        if (tokens[at++] !== '(') return null;
        var args = [expressionValue()];
        while (tokens[at] === ',') { at += 1; args.push(expressionValue()); }
        if (tokens[at++] !== ')' || args.some(function (value) { return value === null; })) return null;
        if ((name === 'min' || name === 'max') && args.length)
          return Math[name].apply(Math, args);
        if (args.length !== 1) return null;
        return Math[name](args[0]);
      }
      return /^\d+(?:\.\d+)?$/.test(token || '') ? Number(token) : null;
    }
    function term() {
      var value = primary();
      while (value !== null && (tokens[at] === '*' || tokens[at] === '/')) {
        var op = tokens[at++];
        var right = primary();
        if (right === null || (op === '/' && right === 0)) return null;
        value = op === '*' ? value * right : value / right;
      }
      return value;
    }
    function expressionValue() {
      var value = term();
      while (value !== null && (tokens[at] === '+' || tokens[at] === '-')) {
        var op = tokens[at++];
        var right = term();
        if (right === null) return null;
        value = op === '+' ? value + right : value - right;
      }
      return value;
    }
    var result = expressionValue();
    return at === tokens.length && result !== null && isFinite(result) ? result : null;
  }

  function resolvedResourceValue(characterId, raw, defaults, rowContext) {
    var source = trim(raw);
    if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(source)) {
      var direct = Number(source);
      return { number: direct, text: String(direct) };
    }
    var resolved = resolvedRollExpression(characterId, source,
      rowContext && rowContext.scopes || [], 0, {}, defaults, rowContext);
    if (!resolved)
      return { number: null, text: source.indexOf('@{') > -1 ? '확인 필요' : source };
    if (!/(?:^|[^A-Za-z0-9_])(?:\d*)d\d+(?:[^A-Za-z0-9_]|$)/i.test(resolved)) {
      if (/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(resolved)) {
        var numeric = Number(resolved);
        return { number: numeric, text: String(numeric) };
      }
      var calculated = arithmeticValue(resolved);
      if (calculated !== null) {
        calculated = Math.round(calculated * 100) / 100;
        return { number: calculated, text: String(calculated) };
      }
    }
    return { number: null, text: resolved.indexOf('@{') > -1 ? '확인 필요' : resolved };
  }

  function getAttr(characterId, name, valueType) {
    if (!characterId || !name) return undefined;
    try {
      return getAttrByName(characterId, name, valueType || 'current');
    } catch (err) {
      return undefined;
    }
  }

  function cachedAttrReader(characterId) {
    var values = dictionary();
    return function (name, type) {
      var key = trim(name) + '|' + (type || 'current');
      if (!own(values, key)) values[key] = getAttr(characterId, name, type);
      return values[key];
    };
  }

  function attrObjects(characterId) {
    return (
      findObjs({ _type: 'attribute', _characterid: characterId }) ||
      findObjs({ type: 'attribute', characterid: characterId }) ||
      []
    );
  }

  function characterObjects() {
    return (findObjs({ _type: 'character' }) || findObjs({ type: 'character' }) || [])
      .slice()
      .sort(function (a, b) {
        return trim(a.get('name')).localeCompare(trim(b.get('name')));
      });
  }

  function initState() {
    state.KIBSheetHelper = state.KIBSheetHelper || {};
    var data = state.KIBSheetHelper;
    if (typeof data.managerId !== 'string') data.managerId = '';
    if (typeof data.managerCharacterId !== 'string') data.managerCharacterId = '';
    if (typeof data.managerHash !== 'string') data.managerHash = '';
    if (typeof data.playerHelpId !== 'string') data.playerHelpId = '';
    if (typeof data.playerHelpHash !== 'string') data.playerHelpHash = '';
    if (!/^(?:public|gm|off)$/.test(data.trackingMode || ''))
      data.trackingMode = own(state, 'hide_tracking') && typeof state.hide_tracking === 'boolean'
        ? state.hide_tracking ? 'gm' : 'public'
        : 'gm';
    if (typeof data.trackGmOnly !== 'boolean') data.trackGmOnly = false;
    data.version = VERSION;
    return data;
  }

  function collectRows(characterId, section, fields, objects, knownPrefixes) {
    var prefix = 'repeating_' + section + '_';
    var attributes = objects || attrObjects(characterId);
    var prefixes = Array.isArray(knownPrefixes) ? knownPrefixes.slice().sort(function (left, right) {
      return right.length - left.length;
    }) : null;
    var sortedFields = fields.slice().sort(function (a, b) {
      return b.length - a.length;
    });
    var rows = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name.indexOf(prefix) !== 0) return;
      if (prefixes) {
        var matchedPrefix = '';
        for (var p = 0; p < prefixes.length; p++) {
          if (name.indexOf(prefixes[p]) === 0) { matchedPrefix = prefixes[p]; break; }
        }
        if (matchedPrefix && matchedPrefix !== prefix) return;
      }
      for (var i = 0; i < sortedFields.length; i++) {
        var field = sortedFields[i];
        var suffix = '_' + field;
        if (name.length <= prefix.length + suffix.length) continue;
        if (name.substring(name.length - suffix.length) !== suffix) continue;
        var rowId = name.substring(prefix.length, name.length - suffix.length);
        if (!rows[rowId]) {
          rows[rowId] = { id: rowId, values: dictionary(), names: dictionary(), refs: dictionary() };
        }
        rows[rowId].values[field] = attribute.get('current');
        rows[rowId].names[field] = name;
        rows[rowId].refs[field] = name;
        break;
      }
    });
    var orderName = '_reporder_repeating_' + section;
    var orderAttribute = attributes.filter(function (attribute) {
      return trim(attribute.get('name')) === orderName;
    })[0];
    var ordered = trim(orderAttribute && orderAttribute.get('current'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    var orderedRows = dictionary();
    ordered.forEach(function (rowId) { orderedRows[rowId] = true; });
    Object.keys(rows).sort().forEach(function (rowId) {
      if (!orderedRows[rowId]) {
        ordered.push(rowId);
        orderedRows[rowId] = true;
      }
    });
    ordered = ordered.filter(function (rowId) {
      return !!rows[rowId];
    });
    ordered.forEach(function (rowId, index) {
      fields.forEach(function (field) {
        var row = rows[rowId];
        var exactName = prefix + rowId + '_' + field;
        if (!row.names[field]) row.names[field] = exactName;
        if (own(row.values, field)) return;
        var orderedName = prefix + '$' + index + '_' + field;
        var value = getAttr(characterId, orderedName);
        if (value === undefined) return;
        row.values[field] = value;
        row.refs[field] = orderedName;
      });
    });
    return ordered.map(function (rowId) {
      return rows[rowId];
    });
  }

  // ===== 시트 HTML 인식 =====
  function sheetContracts() {
    var found = dictionary();
    var result = [];
    if (!Array.isArray(KIBSheetContracts)) return result;
    for (var i = KIBSheetContracts.length - 1; i >= 0; i--) {
      var contract = KIBSheetContracts[i];
      if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) || found[contract.id]) continue;
      found[contract.id] = true;
      result.unshift(contract);
    }
    return result;
  }

  function registerContract(contract) {
    if (!contract || !contract.id || !contract.signature || !Array.isArray(contract.rolls) ||
      (!contractSignature(contract).entries.length && !(Array.isArray(contract.attributes) && contract.attributes.length)))
      throw new Error('시트 인식 정보 형식이 올바르지 않습니다.');
    var replaced = false;
    KIBSheetContracts = KIBSheetContracts.map(function (current) {
      if (current && current.id === contract.id) {
        replaced = true;
        return contract;
      }
      return current;
    });
    if (!replaced) KIBSheetContracts.push(contract);
    contractIndexCache = {};
    contractCatalogCache = null;
    invalidate();
    return contract;
  }

  function contractSignature(contract) {
    var source = contract && contract.signature;
    var entries = [];
    var minimum = 0;
    var requiredNames = [];
    if (Array.isArray(source)) {
      entries = source;
    } else if (source && typeof source === 'object') {
      var attrs = source.attrs || source.attributes || source.required;
      if (Array.isArray(source.required)) requiredNames = source.required.map(trim);
      if (Array.isArray(attrs)) entries = attrs;
      else {
        Object.keys(source).forEach(function (name) {
          if (/^(?:min|minimum|threshold|attrs|attributes|required)$/i.test(name)) return;
          entries.push({ name: name, weight: source[name] });
        });
      }
      minimum = Number(source.minimum || source.min || source.threshold);
    }
    entries = entries.map(function (entry) {
      if (typeof entry === 'string') return { name: trim(entry), weight: 1, required: requiredNames.indexOf(trim(entry)) > -1 };
      return {
        name: trim(entry && (entry.name || entry.attr || entry.key)),
        weight: Math.max(1, Number(entry && entry.weight) || 1),
        required: !!(entry && entry.required) || requiredNames.indexOf(trim(entry && (entry.name || entry.attr || entry.key))) > -1,
      };
    }).filter(function (entry) { return !!entry.name; });
    var total = entries.reduce(function (sum, entry) { return sum + entry.weight; }, 0);
    if (!(minimum > 0)) minimum = Math.min(total, Math.max(3, Math.ceil(total * 0.6)));
    return { entries: entries, minimum: minimum, total: total };
  }

  function contractDefaultMap(contract) {
    var result = dictionary();
    (contract && contract.fields || []).forEach(function (field) {
      var name = trim(field && field.name);
      if (!name || field.section || !own(field, 'default')) return;
      result[name] = String(field.default == null ? '' : field.default);
    });
    return result;
  }

  function normalizedDefault(value) {
    return trim(value).toLowerCase().replace(/\s+/g, '');
  }

  function sourceDefaultEvidence(characterId, records, savedNames) {
    var scores = records.map(function () { return 0; });
    var blankContradictions = records.map(function () { return 0; });
    var active = records.slice();
    var used = dictionary();
    var probes = [];
    var reads = cachedAttrReader(characterId);
    function expectedDefault(record, name) {
      return own(record.defaults, name)
        ? 'value:' + normalizedDefault(record.defaults[name])
        : 'missing';
    }
    var available = dictionary();
    records.forEach(function (record) {
      Object.keys(record.defaults || {}).forEach(function (name) { available[name] = true; });
    });
    var defaultNames = Object.keys(available).sort();
    var defaultValues = dictionary();
    defaultNames.forEach(function (name) {
      defaultValues[name] = records.map(function (record) {
        return expectedDefault(record, name);
      });
    });
    function nextField() {
      if (!active.length) return '';
      if (active.length === 1) {
        for (var only = 0; only < defaultNames.length; only += 1) {
          var confirmation = defaultNames[only];
          if (!used[confirmation] && !(savedNames && savedNames[confirmation]) &&
              own(active[0].defaults || {}, confirmation) &&
              normalizedDefault((active[0].defaults || {})[confirmation])) return confirmation;
        }
        return '';
      }
      var selected = '';
      var selectedSeparation = -1;
      for (var fieldAt = 0; fieldAt < defaultNames.length; fieldAt += 1) {
        var name = defaultNames[fieldAt];
        if (used[name] || savedNames && savedNames[name]) continue;
        var counts = dictionary();
        var hasNonEmpty = false;
        for (var activeAt = 0; activeAt < active.length; activeAt += 1) {
          var expected = defaultValues[name][active[activeAt].ordinal];
          counts[expected] = (counts[expected] || 0) + 1;
          if (/^value:.+/.test(expected)) hasNonEmpty = true;
        }
        var groups = Object.keys(counts);
        if (!hasNonEmpty || groups.length < 2) continue;
        var separation = active.length * active.length;
        groups.forEach(function (value) {
          separation -= counts[value] * counts[value];
        });
        if (separation > selectedSeparation) {
          selected = name;
          selectedSeparation = separation;
        }
      }
      return selected;
    }
    for (var attempt = 0; attempt < 24; attempt += 1) {
      var name = nextField();
      if (!name) break;
      used[name] = true;
      var rawActual = reads(name);
      var actual = normalizedDefault(rawActual);
      if (rawActual === undefined || rawActual === null || !actual) {
        records.forEach(function (record) {
          if (/^value:.+/.test(defaultValues[name][record.ordinal])) blankContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: [] });
      } else {
        var actualDefault = 'value:' + actual;
        var matched = records.filter(function (record) {
          return defaultValues[name][record.ordinal] === actualDefault;
        });
        matched.forEach(function (record) {
          scores[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: matched.map(function (record) { return record.contract.id; }) });
      }
      var strongest = Math.max.apply(Math, scores);
      var candidates = strongest >= 2 ? records.filter(function (record) {
        return scores[record.ordinal] >= 2 || blankContradictions[record.ordinal] < 2;
      }) : records.slice();
      if (!candidates.length) candidates = records.slice();
      var ranked = candidates.sort(function (left, right) {
        return scores[right.ordinal] - scores[left.ordinal] || left.ordinal - right.ordinal;
      });
      var bestScore = scores[ranked[0].ordinal];
      var best = ranked.filter(function (record) { return scores[record.ordinal] === bestScore; });
      var runnerScore = ranked[best.length] ? scores[ranked[best.length].ordinal] : 0;
      if (best.length === 1 && bestScore >= 2 && (bestScore - runnerScore >= 2 || ranked.length === 1))
        return { record: best[0], survivors: ranked, scores: scores, probes: probes, matched: true };
      active = ranked.filter(function (record) {
        return scores[record.ordinal] >= Math.max(0, bestScore - 1);
      });
    }
    return { record: null, survivors: active, scores: scores, probes: probes, matched: false };
  }

  function roomSourceDefaultEvidence(characters, records, ownersByName) {
    var fallback = { record: null, survivors: records.slice(), scores: records.map(function () { return 0; }), probes: [], matched: false };
    var candidates = (characters || []).slice().sort(function (left, right) {
      function savedCount(character) {
        var count = 0;
        Object.keys(ownersByName || {}).forEach(function (name) {
          if (ownersByName[name] && ownersByName[name][character.id]) count += 1;
        });
        return count;
      }
      return savedCount(left) - savedCount(right) ||
        trim(left.get('name')).localeCompare(trim(right.get('name')));
    });
    for (var index = 0; index < candidates.length; index += 1) {
      var character = candidates[index];
      var savedNames = dictionary();
      Object.keys(ownersByName || {}).forEach(function (name) {
        if (ownersByName[name] && ownersByName[name][character.id]) savedNames[name] = true;
      });
      var evidence = sourceDefaultEvidence(character.id, records, savedNames);
      evidence.characterId = character.id;
      if (evidence.matched) return evidence;
      if (evidence.survivors.length < fallback.survivors.length ||
          evidence.survivors.length === fallback.survivors.length && evidence.probes.length > fallback.probes.length)
        fallback = evidence;
    }
    return fallback;
  }

  function trieNode() {
    return { next: dictionary(), values: [] };
  }

  function trieAdd(root, value, entry) {
    var node = root;
    for (var i = 0; i < value.length; i += 1) {
      var character = value.charAt(i);
      if (!node.next[character]) node.next[character] = trieNode();
      node = node.next[character];
    }
    node.values.push(entry);
  }

  function triePrefixes(root, value) {
    var node = root;
    var result = [];
    for (var i = 0; i < value.length; i += 1) {
      node = node.next[value.charAt(i)];
      if (!node) break;
      if (node.values.length) result = result.concat(node.values);
    }
    return result;
  }

  function fieldSuffixTrie(fields) {
    var root = trieNode();
    (fields || []).forEach(function (field) {
      var suffix = '_' + field;
      trieAdd(root, suffix.split('').reverse().join(''), field);
    });
    return root;
  }

  function matchedField(root, name, prefixLength) {
    var node = root;
    var found = '';
    for (var i = name.length - 1; i >= prefixLength; i -= 1) {
      node = node.next[name.charAt(i)];
      if (!node) break;
      if (node.values.length) found = node.values[0];
    }
    return found;
  }

  function recognitionCatalog(contracts) {
    if (contractCatalogCache && contractCatalogCache.contracts.length === contracts.length &&
        contractCatalogCache.contracts.every(function (contract, index) { return contract === contracts[index]; }))
      return contractCatalogCache;
    var catalog = { contracts: contracts.slice(), records: [], exact: dictionary(), prefixes: trieNode() };
    function post(name, posting) {
      if (!name) return;
      if (!catalog.exact[name]) catalog.exact[name] = [];
      catalog.exact[name].push(posting);
    }
    contracts.forEach(function (contract, ordinal) {
      var signature = contractSignature(contract);
      var runtime = contractRuntimeIndex(contract);
      var attributes = Array.isArray(contract.attributes) ? contract.attributes.map(trim).filter(Boolean) : [];
      var record = {
        contract: contract,
        ordinal: ordinal,
        signature: signature,
        attributes: attributes,
        defaults: contractDefaultMap(contract),
        required: signature.entries.filter(function (entry) { return entry.required; }).map(function (entry) { return entry.name; }),
      };
      catalog.records.push(record);
      signature.entries.forEach(function (entry) {
        post(entry.name, { record: record, type: 'signature', weight: entry.weight });
      });
      Object.keys(runtime.exact).forEach(function (name) {
        post(name, { record: record, type: signature.total ? 'dependency' : 'source', key: name });
      });
      runtime.prefixes.forEach(function (prefix) {
        var section = prefix.substring(10, prefix.length - 1);
        trieAdd(catalog.prefixes, prefix, {
          record: record,
          prefix: prefix,
          section: section,
          fields: fieldSuffixTrie(runtime.sections[section] || []),
        });
      });
    });
    contractCatalogCache = catalog;
    return catalog;
  }

  function inspectContracts(characterId) {
    if (contractMatchCache.__room__) {
      if (characterId) contractMatchCache[characterId] = contractMatchCache.__room__;
      return contractMatchCache.__room__;
    }
    var defaultEvidence = { probes: [], scores: [], matched: false };
    function remember(result) {
      result.attributeCount = persistentTotal;
      result.contractCount = contracts.length;
      contractMatchCache.__room__ = result;
      if (characterId) contractMatchCache[characterId] = result;
      return result;
    }
    // Roll20 방에는 한 종류의 캐릭터 시트가 적용됩니다. 캐릭터별 저장값의
    // 차이 때문에 판별 결과가 갈리지 않도록, 실제로 저장된 방 전체 Attribute의
    // 이름만 합쳐 시트 구조를 한 번 판별합니다. 값과 반복행은 이후 현재
    // 캐릭터를 읽을 때만 사용합니다.
    var roomCharacters = characterObjects();
    var liveOwners = dictionary();
    roomCharacters.forEach(function (character) { liveOwners[character.id] = true; });
    var attributes = (
      findObjs({ _type: 'attribute' }) ||
      findObjs({ type: 'attribute' }) ||
      []
    ).filter(function (attribute) {
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      return !!liveOwners[owner];
    });
    var names = dictionary();
    var ownersByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (!name) return;
      names[name] = true;
      var owner = trim(attribute.get('_characterid') || attribute.get('characterid'));
      if (!ownersByName[name]) ownersByName[name] = dictionary();
      if (owner) ownersByName[name][owner] = true;
    });
    var contracts = sheetContracts();
    var catalog = recognitionCatalog(contracts);
    defaultEvidence = roomSourceDefaultEvidence(roomCharacters, catalog.records, ownersByName);
    var nameList = Object.keys(names);
    var persistentTotal = nameList.length;
    var repeatingTotal = nameList.filter(function (name) {
      return name.indexOf('repeating_') === 0;
    }).length;
    var stats = catalog.records.map(function () {
      return {
        signatureScore: 0, signatureSeen: dictionary(), sourceSeen: dictionary(),
        repeatingHits: 0, repeatingSections: dictionary(), support: dictionary(),
        uniqueSeen: dictionary(), uniqueOwners: dictionary(),
      };
    });
    var recognizedFieldsByOwner = dictionary();
    var compatibilityByOwner = dictionary();
    var membershipByOwner = dictionary();
    function markSupport(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.support[owner] = true; });
    }
    function markRecognized(contractsForName, name) {
      var ordinals = Object.keys(contractsForName);
      if (!ordinals.length) return;
      var membership = ordinals.join(',');
      Object.keys(ownersByName[name] || {}).forEach(function (owner) {
        recognizedFieldsByOwner[owner] = (recognizedFieldsByOwner[owner] || 0) + 1;
        if (!compatibilityByOwner[owner]) compatibilityByOwner[owner] = dictionary();
        ordinals.forEach(function (ordinal) {
          compatibilityByOwner[owner][ordinal] = (compatibilityByOwner[owner][ordinal] || 0) + 1;
        });
        if (!membershipByOwner[owner]) membershipByOwner[owner] = dictionary();
        membershipByOwner[owner][membership] = (membershipByOwner[owner][membership] || 0) + 1;
      });
    }
    function markUniqueOwners(stat, name) {
      Object.keys(ownersByName[name] || {}).forEach(function (owner) { stat.uniqueOwners[owner] = true; });
    }
    nameList.forEach(function (name) {
      var exactPostings = catalog.exact[name] || [];
      var exactContracts = dictionary();
      exactPostings.forEach(function (posting) {
        exactContracts[posting.record.ordinal] = true;
        var stat = stats[posting.record.ordinal];
        if (posting.type === 'signature') {
          if (!stat.signatureSeen[name]) {
            stat.signatureSeen[name] = true;
            stat.signatureScore += posting.weight;
            markSupport(stat, name);
          }
        } else if (posting.type === 'source') {
          stat.sourceSeen[posting.key] = true;
          markSupport(stat, name);
        }
      });
      var exactOrdinals = Object.keys(exactContracts);
      if (exactOrdinals.length === 1) {
        var exactStat = stats[Number(exactOrdinals[0])];
        exactStat.uniqueSeen[name] = true;
        markUniqueOwners(exactStat, name);
        markSupport(exactStat, name);
      }
      if (name.indexOf('repeating_') !== 0) {
        markRecognized(exactContracts, name);
        return;
      }
      var matches = triePrefixes(catalog.prefixes, name);
      var seenContracts = dictionary();
      var matchedByContract = dictionary();
      for (var index = matches.length - 1; index >= 0; index -= 1) {
        var match = matches[index];
        var ordinal = match.record.ordinal;
        if (seenContracts[ordinal]) continue;
        var field = matchedField(match.fields, name, match.prefix.length);
        if (!field) continue;
        seenContracts[ordinal] = true;
        var repeatingStat = stats[ordinal];
        repeatingStat.repeatingHits += 1;
        repeatingStat.repeatingSections[match.section] = true;
        markSupport(repeatingStat, name);
        matchedByContract[ordinal] = match.prefix + field;
        if (!match.record.signature.total) repeatingStat.sourceSeen[match.prefix + field] = true;
      }
      var repeatingOrdinals = Object.keys(matchedByContract);
      repeatingOrdinals.forEach(function (ordinal) { exactContracts[ordinal] = true; });
      markRecognized(exactContracts, name);
      if (repeatingOrdinals.length === 1) {
        var repeatingOrdinal = Number(repeatingOrdinals[0]);
        stats[repeatingOrdinal].uniqueSeen[matchedByContract[repeatingOrdinal]] = true;
        markUniqueOwners(stats[repeatingOrdinal], name);
      }
    });
    var recognizedOwnerCount = Object.keys(recognizedFieldsByOwner).length;
    var compatibilityVotes = catalog.records.map(function () { return 0; });
    Object.keys(recognizedFieldsByOwner).forEach(function (owner) {
      var total = recognizedFieldsByOwner[owner];
      if (total < 2) return;
      var coverage = compatibilityByOwner[owner] || {};
      var ranked = catalog.records.map(function (record) {
        return { ordinal: record.ordinal, count: coverage[record.ordinal] || 0 };
      }).sort(function (left, right) {
        return right.count - left.count || left.ordinal - right.ordinal;
      });
      var best = ranked[0];
      var runnerUp = ranked[1] || { ordinal: -1, count: 0 };
      if (!best || best.count / total < 0.9 || best.count <= runnerUp.count) return;
      var bestOnly = 0;
      var runnerOnly = 0;
      Object.keys(membershipByOwner[owner] || {}).forEach(function (membership) {
        var members = (',' + membership + ',');
        var count = membershipByOwner[owner][membership];
        var hasBest = members.indexOf(',' + best.ordinal + ',') >= 0;
        var hasRunner = members.indexOf(',' + runnerUp.ordinal + ',') >= 0;
        if (hasBest && !hasRunner) bestOnly += count;
        if (hasRunner && !hasBest) runnerOnly += count;
      });
      var completeFieldAdvantage = total >= 5 && best.count === total && bestOnly >= 1 && runnerOnly === 0;
      if (completeFieldAdvantage || (bestOnly >= 2 && bestOnly > runnerOnly))
        compatibilityVotes[best.ordinal] += 1;
    });
    var scored = catalog.records.map(function (record) {
      var contract = record.contract;
      var signature = record.signature;
      var stat = stats[record.ordinal];
      var signatureScore = stat.signatureScore;
      var sourceScore = Object.keys(stat.sourceSeen).length;
      var missingRequired = record.required.filter(function (name) { return !stat.signatureSeen[name]; });
      var contractAttributes = record.attributes;
      var repeatingHits = stat.repeatingHits;
      var repeatingSections = stat.repeatingSections;
      var supportCount = Object.keys(stat.support).length;
      var uniqueEvidence = Object.keys(stat.uniqueSeen).length;
      var uniqueOwnerCount = Object.keys(stat.uniqueOwners).length;
      var useSignature = signature.total > 0;
      var score = useSignature ? signatureScore : sourceScore;
      var total = useSignature ? signature.total : contractAttributes.length;
      var minimum = useSignature ? signature.minimum : Math.min(3, total);
      var ratio = total ? score / total : 0;
      var structuralMatch = useSignature || ratio >= 0.6 || (score >= 6 && ratio >= 0.4);
      var repeatingRatio = repeatingTotal ? repeatingHits / repeatingTotal : 1;
      var rankScore = score + repeatingHits * 2 + Object.keys(repeatingSections).length * 3;
      return {
        contract: contract,
        id: contract.id,
        name: contract.name || contract.id,
        score: score,
        ratio: ratio,
        repeatingHits: repeatingHits,
        repeatingTotal: repeatingTotal,
        repeatingRatio: repeatingRatio,
        supportCount: supportCount,
        uniqueEvidence: uniqueEvidence,
        uniqueOwnerCount: uniqueOwnerCount,
        compatibilityOwnerCount: compatibilityVotes[record.ordinal],
        defaultMatchCount: defaultEvidence.scores[record.ordinal] || 0,
        rankScore: rankScore,
        minimum: minimum,
        missingRequired: missingRequired,
        eligible: total > 0 && missingRequired.length === 0 && score >= minimum && structuralMatch,
      };
    }).sort(function (a, b) {
      return b.compatibilityOwnerCount - a.compatibilityOwnerCount ||
        b.supportCount - a.supportCount || b.uniqueEvidence - a.uniqueEvidence || b.rankScore - a.rankScore ||
        b.repeatingHits - a.repeatingHits || b.score - a.score || b.ratio - a.ratio;
    });
    if (defaultEvidence.matched) {
      var match = scored.filter(function (item) {
        return item.id === defaultEvidence.record.contract.id;
      })[0];
      return remember({ status: 'matched', contract: defaultEvidence.record.contract,
        match: match, matches: scored, recognitionReason: 'source-defaults' });
    }
    var sourceSurvivors = dictionary();
    (defaultEvidence.survivors || []).forEach(function (record) { sourceSurvivors[record.contract.id] = true; });
    var sourceSurvivorCount = Object.keys(sourceSurvivors).length;
    var sourceNarrowed = sourceSurvivorCount > 0 && sourceSurvivorCount < catalog.records.length;
    var selection = sourceNarrowed
      ? scored.filter(function (item) { return sourceSurvivors[item.id]; })
      : scored;
    if (sourceNarrowed)
      return remember({
        status: 'ambiguous', contract: null, matches: selection,
        error: SHEET_NOT_RECOGNIZED,
        recognitionReason: 'source-defaults-ambiguous',
      });
    var compatibilityWinner = selection.filter(function (item) {
      return item.compatibilityOwnerCount * 2 > recognizedOwnerCount;
    });
    if (compatibilityWinner.length === 1)
      return remember({ status: 'matched', contract: compatibilityWinner[0].contract,
        match: compatibilityWinner[0], matches: selection, recognitionReason: 'stored-attributes' });
    var eligible = selection.filter(function (item) { return item.eligible; });
    if (!eligible.length) {
      if (!selection.length) return remember({ status: 'none', contract: null, matches: [], recognitionReason: 'no-contracts' });
      var evidence = selection[0];
      var runnerUp = selection[1];
      if (evidence.uniqueEvidence >= 2 && (!runnerUp ||
          evidence.supportCount > runnerUp.supportCount || runnerUp.uniqueEvidence === 0) &&
          evidence.uniqueOwnerCount * 2 > recognizedOwnerCount)
        return remember({ status: 'matched', contract: evidence.contract, match: evidence, matches: selection,
          recognitionReason: 'stored-unique-attributes' });
      return remember({
        status: 'ambiguous', contract: null, matches: selection,
        error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous'
          : persistentTotal ? 'insufficient-or-conflicting-evidence' : 'no-saved-attributes-or-default-match',
      });
    }
    var best = eligible[0];
    if (best.supportCount * 2 <= recognizedOwnerCount) {
      return remember({ status: 'ambiguous', contract: null, matches: selection, error: SHEET_NOT_RECOGNIZED,
        recognitionReason: sourceNarrowed
          ? 'source-defaults-ambiguous' : 'insufficient-room-support' });
    }
    var close = eligible.filter(function (item) {
      return item.supportCount === best.supportCount && best.rankScore - item.rankScore <= 2 &&
        best.ratio - item.ratio < 0.1 && Math.abs(best.repeatingHits - item.repeatingHits) <= 1;
    });
    if (close.length === 1)
      return remember({ status: 'matched', contract: best.contract, match: best, matches: selection,
        recognitionReason: 'stored-signature' });
    return remember({ status: 'ambiguous', contract: null, matches: close, error: SHEET_NOT_RECOGNIZED,
      recognitionReason: sourceNarrowed
        ? 'source-defaults-ambiguous' : 'conflicting-candidates' });
  }

  function contractControlList(source) {
    if (Array.isArray(source)) return source;
    if (!source || typeof source !== 'object') return [];
    return Object.keys(source).map(function (name) {
      var value = source[name];
      if (value && typeof value === 'object' && !Array.isArray(value))
        return merge({ name: name }, value);
      return { name: name, options: Array.isArray(value) ? value : [value] };
    });
  }

  function contractControls(contract, roll) {
    var controls = contractControlList(contract && contract.controls);
    contractControlList(roll && roll.controls).forEach(function (local) {
      var name = trim(local && (local.name || local.attr || local.key));
      controls = controls.filter(function (control) {
        return trim(control && (control.name || control.attr || control.key)) !== name;
      });
      controls.push(local);
    });
    return controls;
  }

  function contractControlName(control) {
    return trim(control && (control.name || control.attr || control.key));
  }

  function contractVisibilityResult(condition, valueReader) {
    if (!condition || typeof condition !== 'object') return null;
    if (Array.isArray(condition.all)) {
      if (!condition.all.length) return null;
      var allUnknown = false;
      for (var allIndex = 0; allIndex < condition.all.length; allIndex += 1) {
        var allValue = contractVisibilityResult(condition.all[allIndex], valueReader);
        if (allValue === false) return false;
        if (allValue === null) allUnknown = true;
      }
      return allUnknown ? null : true;
    }
    if (Array.isArray(condition.any)) {
      if (!condition.any.length) return null;
      var anyUnknown = false;
      for (var anyIndex = 0; anyIndex < condition.any.length; anyIndex += 1) {
        var anyValue = contractVisibilityResult(condition.any[anyIndex], valueReader);
        if (anyValue === true) return true;
        if (anyValue === null) anyUnknown = true;
      }
      return anyUnknown ? null : false;
    }
    if (condition.not) {
      var negated = contractVisibilityResult(condition.not, valueReader);
      return negated === null ? null : !negated;
    }
    var name = trim(condition.name);
    var op = trim(condition.op).toLowerCase();
    if (!name || !op || typeof valueReader !== 'function') return null;
    var resolved = valueReader(name, condition);
    if (!resolved || resolved.known !== true) return null;
    var actual = String(resolved.value == null ? '' : resolved.value);
    var expected = String(condition.value == null ? '' : condition.value);
    var matched;
    if (op === 'eq' || op === 'not-eq' || op === 'neq') matched = actual === expected;
    else if (op === 'starts' || op === 'not-starts') matched = actual.indexOf(expected) === 0;
    else if (op === 'ends' || op === 'not-ends') matched = expected === '' || actual.slice(actual.length - expected.length) === expected;
    else if (op === 'contains' || op === 'not-contains') matched = actual.indexOf(expected) > -1;
    else if (op === 'token' || op === 'not-token') matched = actual.split(/\s+/).indexOf(expected) > -1;
    else if (op === 'dash' || op === 'not-dash') matched = actual === expected || actual.indexOf(expected + '-') === 0;
    else return null;
    return op.indexOf('not-') === 0 || op === 'neq' ? !matched : matched;
  }

  function contractOptionValues(control) {
    var source = control && (control.options || control.values);
    if (!Array.isArray(source) && source && typeof source === 'object') {
      source = Object.keys(source).map(function (key) {
        var option = source[key];
        return option && typeof option === 'object' ? option : { label: key, value: option };
      });
    }
    return (Array.isArray(source) ? source : []).map(function (option) {
      return String(option && typeof option === 'object' && own(option, 'value') ? option.value : option);
    });
  }

  function contractOverrides(mode) {
    var source = mode && mode.overrides;
    var result = dictionary();
    if (Array.isArray(source)) {
      source.forEach(function (entry) {
        var name = trim(entry && (entry.name || entry.attr || entry.key));
        if (name && own(entry, 'value')) result[name] = String(entry.value);
      });
    } else if (source && typeof source === 'object') {
      Object.keys(source).forEach(function (name) { result[name] = String(source[name]); });
    }
    return result;
  }

  function contractQueries(mode) {
    var source = mode && mode.queries;
    var result = [];
    if (Array.isArray(source)) result = source;
    else if (source && typeof source === 'object') {
      result = Object.keys(source).map(function (name) {
        var entry = source[name];
        return entry && typeof entry === 'object'
          ? merge({ name: name }, entry)
          : { name: name, value: entry };
      });
    }
    return result.map(function (entry) {
      var name = trim(entry && (entry.name || entry.label || entry.key));
      var duplicate = name.match(/#(\d+)$/);
      return {
        name: duplicate ? trim(name.substring(0, duplicate.index)) : name,
        occurrence: duplicate ? Number(duplicate[1]) : 1,
        raw: String(entry && (entry.raw || entry.query || entry.token) || ''),
        value: String(entry && own(entry, 'value') ? entry.value : ''),
      };
    }).filter(function (entry) { return entry.raw || entry.name; });
  }

  function contractOverridesValid(contract, roll, mode) {
    var controls = contractControls(contract, roll);
    var overrides = contractOverrides(mode);
    return Object.keys(overrides).every(function (name) {
      var control = controls.filter(function (candidate) {
        return contractControlName(candidate) === name;
      })[0];
      return !!control && contractOptionValues(control).indexOf(String(overrides[name])) > -1;
    });
  }

  function contractRefName(ref) {
    return trim(typeof ref === 'string' ? ref : ref && (ref.name || ref.attr || ref.key));
  }

  function contractRepeating(roll) {
    var source = roll && roll.repeating;
    if (!source) return null;
    function sectionName(value) { return trim(value).replace(/^repeating_/i, ''); }
    if (typeof source === 'string') return { section: sectionName(source), fields: [], source: trim(source) };
    return {
      section: sectionName(source.section || source.name),
      fields: Array.isArray(source.fields) ? source.fields.map(contractRefName).filter(Boolean) : [],
      source: trim(source.section || source.name),
    };
  }

  function contractSections(contract) {
    var source = contract && contract.sections;
    var sections = dictionary();
    if (!source || typeof source !== 'object' || Array.isArray(source)) return sections;
    Object.keys(source).forEach(function (section) {
      var name = trim(section).replace(/^repeating_/i, '');
      var fields = Array.isArray(source[section]) ? source[section].map(contractRefName).filter(Boolean) : [];
      if (name && fields.length) sections[name] = fields;
    });
    return sections;
  }

  function contractRollFields(contract, roll, controlMap) {
    var repeating = contractRepeating(roll);
    if (!repeating) return [];
    var fields = repeating.fields.slice();
    [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
      (Array.isArray(refs) ? refs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        var rowLocal = typeof ref === 'object' && (ref.row === true || ref.repeating === true || ref.scope === 'row');
        var control = controlMap && controlMap[name];
        if (!control) control = contractControls(contract, roll).filter(function (candidate) {
          return contractControlName(candidate) === name;
        })[0];
        var controlSection = trim(control && control.repeating).replace(/^repeating_/i, '');
        if (name && (rowLocal || controlSection === repeating.section) && fields.indexOf(name) < 0) fields.push(name);
      });
    });
    return fields;
  }

  function contractRowAttr(contract, roll, row, name) {
    if (!row) return name;
    var index = contractRuntimeIndex(contract);
    var fields = index.rollFields[roll.key] || contractRollFields(contract, roll, index.controls);
    return fields.indexOf(name) > -1 ? (row.refs[name] || row.names[name] || name) : name;
  }

  function contractLabelRef(characterId, contract, roll, row, ref, reader) {
    var name = contractRefName(ref);
    if (!name) return '';
    var fullName = contractRowAttr(contract, roll, row, name);
    return trim(reader
      ? reader(fullName, ref && ref.max ? 'max' : 'current')
      : getAttr(characterId, fullName, ref && ref.max ? 'max' : 'current'));
  }

  function contractStaticLabels(roll) {
    var source = roll && roll.staticLabels;
    return (Array.isArray(source) ? source : source ? [source] : []).map(function (entry) {
      return trim(entry && typeof entry === 'object' ? entry.value : entry);
    }).filter(Boolean);
  }

  function contractModeLabels(mode) {
    var labels = [mode && mode.label].concat(mode && mode.aliases || []);
    var path = mode && mode.labelPath;
    if (Array.isArray(path)) {
      if (path.length) labels.push(path.join(' '));
      labels = labels.concat(path.slice().reverse());
    } else if (path) {
      labels.push(path);
      labels = labels.concat(String(path).split(/\s*(?:>|\/|\||::)\s*/));
    }
    labels.push(mode && mode.id);
    var found = dictionary();
    return labels.map(trim).filter(function (label) {
      var key = normalize(label);
      if (!key || found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function contractUserModeLabels(mode) {
    var internalId = normalize(mode && mode.id);
    return contractModeLabels(mode).filter(function (label) {
      var key = normalize(label);
      return key && key !== internalId && !/^mode-?[a-f0-9]{8,}$/i.test(key) &&
        humanContractLabel(label) && !/[?@%&]\{|\{\{|\[\[/.test(label);
    });
  }

  function contractRuntimeIndex(contract) {
    var key = String(contract.id) + '|' + String(contract.sourceHash || '') + '|' + contract.rolls.length;
    var cached = contractIndexCache[key];
    if (cached && cached.contract === contract) return cached;
    var index = {
      contract: contract,
      controls: dictionary(),
      exact: dictionary(),
      prefixes: [],
      sections: dictionary(),
      rollFields: dictionary(),
      rollControls: dictionary(),
      labelRefFrequency: dictionary(),
      fieldGlobal: dictionary(),
      fieldSections: dictionary(),
      fieldPrefixes: trieNode(),
    };
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      if (!field.section) {
        index.fieldGlobal[trim(field.name)] = field;
        index.exact[trim(field.name)] = true;
      }
      else {
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (!index.fieldSections[section]) index.fieldSections[section] = dictionary();
        index.fieldSections[section][trim(field.name)] = field;
      }
    });
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || !trim(field.name)) return;
      function addDependency(name, scope) {
        name = trim(name);
        if (!name) return;
        var section = trim(field.section).replace(/^repeating_/i, '');
        if (section && scope !== 'global' && index.fieldSections[section] && index.fieldSections[section][name]) return;
        index.exact[name] = true;
      }
      [field.default, field.max].forEach(function (source) {
        String(source == null ? '' : source).replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (token, name) {
          addDependency(name, '');
          return token;
        });
      });
      (function visit(condition) {
        if (!condition || typeof condition !== 'object') return;
        if (Array.isArray(condition)) {
          condition.forEach(visit);
          return;
        }
        if (condition.name) addDependency(condition.name, trim(condition.scope).toLowerCase());
        ['all', 'any', 'not'].forEach(function (key) { visit(condition[key]); });
      })(field.visibility);
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      var prefix = 'repeating_' + section + '_';
      trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    contractControls(contract).forEach(function (control) {
      var name = contractControlName(control);
      if (name) {
        index.controls[name] = control;
        index.exact[name] = true;
      }
    });
    var exactAttributes = Array.isArray(contract.globalAttributes) ? contract.globalAttributes : contract.attributes;
    (Array.isArray(exactAttributes) ? exactAttributes : []).forEach(function (name) {
      name = trim(name);
      if (name) index.exact[name] = true;
    });
    contractSignature(contract).entries.forEach(function (entry) { index.exact[entry.name] = true; });
    var declaredSections = contractSections(contract);
    Object.keys(declaredSections).forEach(function (section) {
      index.sections[section] = declaredSections[section].slice();
      index.prefixes.push('repeating_' + section + '_');
      index.exact['_reporder_repeating_' + section] = true;
    });
    contract.rolls.forEach(function (roll) {
      if (!roll) return;
      var scopedControls = dictionary();
      contractControls(contract, roll).forEach(function (control) {
        var name = contractControlName(control);
        if (name) scopedControls[name] = control;
      });
      var repeating = contractRepeating(roll);
      var fields = repeating ? contractRollFields(contract, roll, scopedControls) : [];
      function addExact(name) {
        if (name && (!repeating || fields.indexOf(name) < 0)) index.exact[name] = true;
      }
      (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) index.labelRefFrequency[name] = (index.labelRefFrequency[name] || 0) + 1;
      });
      [roll.refs, roll.labelRefs, roll.expressionRefs].forEach(function (refs) {
        (Array.isArray(refs) ? refs : []).forEach(function (ref) {
          addExact(contractRefName(ref));
        });
      });
      Object.keys(scopedControls).forEach(function (name) {
        addExact(name);
      });
      index.rollControls[roll.key] = scopedControls;
      if (!repeating || !repeating.section) return;
      if (!index.sections[repeating.section]) {
        index.sections[repeating.section] = [];
        index.prefixes.push('repeating_' + repeating.section + '_');
        index.exact['_reporder_repeating_' + repeating.section] = true;
      }
      index.rollFields[roll.key] = fields;
      fields.forEach(function (field) {
        if (index.sections[repeating.section].indexOf(field) < 0) index.sections[repeating.section].push(field);
      });
    });
    Object.keys(index.fieldSections).forEach(function (section) {
      if (!index.sections[section]) index.sections[section] = [];
      Object.keys(index.fieldSections[section]).forEach(function (field) {
        if (index.sections[section].indexOf(field) < 0) index.sections[section].push(field);
      });
      var prefix = 'repeating_' + section + '_';
      if (index.prefixes.indexOf(prefix) < 0) index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + section] = true;
    });
    Object.keys(index.sections).forEach(function (section) {
      index.sections[section].sort(function (left, right) { return right.length - left.length; });
    });
    index.prefixes.sort(function (left, right) { return right.length - left.length; });
    contractIndexCache[key] = index;
    return index;
  }

  function humanContractLabel(value) {
    var label = trim(value);
    return !!label && label.length <= 100 &&
      !!label.replace(/[\s!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]+/g, '') &&
      !/^(?:true|false|on|off|null|none)$/i.test(label);
  }

  function contractDisplayLabel(value) {
    var label = trim(value).replace(/^븿\s*/, '');
    if (!humanContractLabel(label)) return '';
    if (/^[\d.,%()+\-*/]+$/.test(label) || /^\d*d\d+(?:[+\-*/]\d+(?:\.\d+)?)?$/i.test(label)) return '';
    if (/^mode-?[a-f0-9]{8,}$/i.test(label) || /^roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^repeating_[^.]+\.roll-?[a-f0-9]{8,}$/i.test(label) ||
      /^[A-Za-z0-9_$-]+_(?:check|roll|attack|damage|u)$/i.test(label)) return '';
    return label;
  }

  function contractRolls(characterId, inspection, objects, includeHidden, readLive) {
    inspection = inspection || inspectContracts(characterId, objects);
    if (!inspection || inspection.status !== 'matched') return [];
    var contract = inspection.contract;
    var attributes = objects || attrObjects(characterId);
    var index = contractRuntimeIndex(contract);
    var attributeValues = dictionary();
    var readCache = dictionary();
    readLive = readLive || cachedAttrReader(characterId);
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeValues[name] = { current: attribute.get('current'), max: attribute.get('max') };
    });
    function read(name, type) {
      var key = name + '|' + type;
      if (own(readCache, key)) return readCache[key];
      if (attributeValues[name]) readCache[key] = attributeValues[name][type];
      else readCache[key] = readLive(name, type);
      return readCache[key];
    }
    var rowsBySection = dictionary();
    Object.keys(index.sections).forEach(function (sectionName) {
      rowsBySection[sectionName] = collectRows(characterId, sectionName, index.sections[sectionName], attributes, index.prefixes);
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
      var repeating = contractRepeating(roll);
      var rows = repeating && repeating.section
        ? rowsBySection[repeating.section] || []
        : [null];
      rows.forEach(function (row) {
        var scopedControls = index.rollControls[roll.key] || dictionary();
        var visibility = contractVisibilityResult(roll.visibility, function (name, atom) {
          var scope = trim(atom && atom.scope).toLowerCase();
          if (scope === 'row' && !row) return { known: false };
          var fullName = scope === 'global' ? name : contractRowAttr(contract, roll, row, name);
          if (own(attributeValues, fullName)) return { known: true, value: attributeValues[fullName].current };
          var liveValue = read(fullName, 'current');
          if (liveValue !== undefined && liveValue !== null && String(liveValue) !== '')
            return { known: true, value: liveValue };
          var control = scope === 'global' ? index.controls[name] : scopedControls[name] || index.controls[name];
          return control && own(control, 'default')
            ? { known: true, value: control.default }
            : { known: false };
        });
        // A contract without CSS has no condition. Unsupported/missing state is unknown and stays usable.
        if (visibility === false && !includeHidden) return;
        var rawVisible = trim(roll.label);
        var visible = contractDisplayLabel(rawVisible);
        if (visible && roll.name && normalize(visible) === normalize(roll.name)) visible = '';
        var staticLabels = contractStaticLabels(roll);
        var dynamic = [];
        var expressionNames = (Array.isArray(roll.expressionRefs) ? roll.expressionRefs : []).map(contractRefName);
        var expressionLabels = [];
        (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
          var refName = contractRefName(ref);
          if (expressionNames.indexOf(refName) > -1) {
            var sourceField = index.fieldGlobal[refName] || scopedControls[refName];
            var sourceLabel = contractDisplayLabel(sourceField && sourceField.label);
            if (sourceLabel && normalize(sourceLabel) !== normalize(refName)) expressionLabels.push(sourceLabel);
            return;
          }
          var value = contractLabelRef(characterId, contract, roll, row, ref, read);
          if (value) dynamic.push({ value: value, frequency: index.labelRefFrequency[refName] || 0 });
        });
        dynamic.sort(function (left, right) { return left.frequency - right.frequency; });
        var usefulDynamic = dynamic.filter(function (entry) { return normalize(entry.value) !== characterName; });
        if (!usefulDynamic.length) usefulDynamic = dynamic;
        var modeSummary = [];
        (Array.isArray(roll.modes) ? roll.modes : []).forEach(function (mode) {
          var label = contractUserModeLabels(mode)[0];
          if (label && modeSummary.indexOf(label) < 0) modeSummary.push(label);
        });
        var rowLabels = usefulDynamic.map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var displayLabels = (row && rowLabels.length ? rowLabels : [visible])
          .concat(staticLabels.map(contractDisplayLabel).filter(Boolean))
          .concat(expressionLabels)
          .concat(row ? [visible] : rowLabels)
          .map(trim).filter(Boolean);
        if (!displayLabels.length && expressionNames.length === 1) displayLabels.push('자유 주사위');
        var labels = displayLabels
          .concat([rawVisible])
          .concat(roll.aliases || [])
          .concat(staticLabels)
          .concat(modeSummary.length && modeSummary.length <= 4 ? [modeSummary.join(' / ')] : [])
          .concat(expressionNames.length === 1 ? ['자유 주사위', expressionNames[0]] : [])
          .concat([roll.name, roll.key])
          .map(trim).filter(Boolean);
        var unique = dictionary();
        labels = labels.filter(function (label) {
          var key = normalize(label);
          if (!key || unique[key]) return false;
          unique[key] = true;
          return true;
        });
        result.push({
          contract: contract,
          roll: roll,
          row: row,
          key: roll.key + (row ? '@' + row.id : ''),
          label: displayLabels[0] || '',
          aliases: labels,
          modes: Array.isArray(roll.modes) ? roll.modes : [],
          hidden: visibility === false,
        });
      });
    });
    return result;
  }

  function actionableContractRolls(characterId, inspection, includeHidden) {
    if (inspection && inspection.status === 'matched') return scannedContractRolls(characterId, includeHidden);
    var candidates = inspection && inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'
      ? (inspection.matches || []).map(function (match) {
        return { status: 'matched', contract: match.contract, match: match, matches: inspection.matches };
      })
      : [];
    if (!candidates.length) return [];
    var objects = attrObjects(characterId);
    var readLive = cachedAttrReader(characterId);
    var rolls = [];
    candidates.forEach(function (candidate) {
      rolls = rolls.concat(contractRolls(characterId, candidate, objects, includeHidden, readLive));
    });
    return rolls;
  }

  function contractFieldMatch(index, name) {
    if (index.fieldGlobal[name]) return { field: index.fieldGlobal[name], name: name, rowId: '' };
    var matches = triePrefixes(index.fieldPrefixes, name);
    for (var i = matches.length - 1; i >= 0; i -= 1) {
      var match = matches[i];
      var fieldName = matchedField(match.fields, name, match.prefix.length);
      if (!fieldName) continue;
      var suffix = '_' + fieldName;
      var rowId = name.substring(match.prefix.length, name.length - suffix.length);
      if (!rowId) continue;
      return {
        field: index.fieldSections[match.section][fieldName],
        name: name,
        rowId: rowId,
        section: match.section,
      };
    }
    return null;
  }

  function localFieldLabel(field) {
    var label = contractDisplayLabel(field && field.label);
    var group = contractDisplayLabel(field && field.groupLabel);
    if (!group) return label;
    var groupKey = normalize(group);
    var candidates = [label].concat(field && field.aliases || []).map(contractDisplayLabel);
    for (var index = 0; index < candidates.length; index += 1) {
      var key = normalize(candidates[index]);
      if (groupKey && key.indexOf(groupKey) === 0) key = key.slice(groupKey.length);
      else if (groupKey && key.slice(-groupKey.length) === groupKey) key = key.slice(0, -groupKey.length);
      if (/^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(key)) return '현재';
      if (/^(?:최대|maximum|max)(?:값|수치|점수|value|score)?$/i.test(key)) return '최대';
      if (/^(?:시작|초기|start|starting|initial)(?:값|수치|점수|value|score)?$/i.test(key)) return '시작';
      if (/^(?:45|80%|threshold|문턱값|기준값)$/i.test(key)) return '4/5';
    }
    return label;
  }

  function fieldLabel(field, rowLabel) {
    var name = trim(field && field.name);
    var label = localFieldLabel(field) || name;
    var group = contractDisplayLabel(field && field.groupLabel);
    var role = normalize(label);
    var generic = /^(?:현재|최대|current|maximum|max|value|score|값|수치|점수)$/i;
    if (group && /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(role)) label = group;
    else if (group && /^(?:최대|maximum|max|시작|초기|start|starting|initial|45|80%|threshold|문턱값|기준값)(?:값|수치|점수|value|score)?$/i.test(role))
      label = /[가-힣]/.test(label) ? label + ' ' + group : group + ' ' + label;
    if (normalize(label) === normalize(name) || generic.test(normalize(label))) {
      var preferred = (field && field.aliases || []).map(contractDisplayLabel).filter(function (alias) {
        return alias && normalize(alias) !== normalize(name) && !generic.test(normalize(alias));
      })[0];
      if (preferred) label = preferred;
    }
    if (rowLabel && normalize(rowLabel) !== normalize(label)) return rowLabel + ' / ' + label;
    return rowLabel || label;
  }

  function userFacingField(field) {
    var name = trim(field && field.name);
    var label = contractDisplayLabel(field && field.label);
    if (label && (normalize(label) !== normalize(name) || /[가-힣]/.test(name))) return true;
    return (field && field.aliases || []).some(function (alias) {
      return contractDisplayLabel(alias) && normalize(alias) !== normalize(name);
    });
  }

  function numericFieldValue(characterId, value, defaults, rowContext) {
    if (value === undefined || value === null || trim(value) === '') return null;
    var resolved = resolvedResourceValue(characterId, value, defaults, rowContext);
    return resolved.number === null || !isFinite(resolved.number) ? null : resolved.number;
  }

  function fieldAliases(field, label, rowLabel, fullName) {
    var seen = dictionary();
    return [label, rowLabel, localFieldLabel(field)]
      .concat(field && field.aliases || [])
      .concat([field && field.name, fullName])
      .map(trim).filter(function (alias) {
        var key = normalize(alias);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function sourceFieldLabels(field, label, rowLabel) {
    var seen = dictionary();
    var group = contractDisplayLabel(field && field.groupLabel);
    var local = localFieldLabel(field);
    return [label, rowLabel, local, group, group && local ? group + ' ' + local : '', group && local ? local + ' ' + group : '']
      .concat(field && field.aliases || [])
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function maximumFieldLabel(labels) {
    return (labels || []).some(function (label) {
      return /^(?:최대|maximum|max)(?:값|수치|점수)?$/i.test(normalize(label)) ||
        /^(?:최대|maximum|max).+$/i.test(normalize(label));
    });
  }

  function fieldPairKeys(labels) {
    var ignored = {
      current: true, maximum: true, max: true, value: true, score: true,
      현재: true, 최대: true, 값: true, 수치: true, 점수: true,
    };
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(label);
      var stripped = key.replace(/^(?:현재|최대|current|maximum|max)/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || ignored[candidate] || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function liveResourceFields(fields) {
    var maximums = dictionary();
    (fields || []).filter(function (field) {
      return !field.section && !field.hidden &&
        /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) &&
        maximumFieldLabel(sourceFieldLabels(field, fieldLabel(field, ''), ''));
    }).forEach(function (field) {
      fieldPairKeys(sourceFieldLabels(field, fieldLabel(field, ''), '')).forEach(function (key) {
        if (!maximums[key]) maximums[key] = [];
        maximums[key].push(field);
      });
    });
    var result = dictionary();
    (fields || []).forEach(function (field) {
      if (field.section || field.hidden || field.readonly || field.disabled || !field.numericCandidate ||
        !userFacingField(field) || !/^(?:text|number|range)$/.test(trim(field.type).toLowerCase())) return;
      if (trim(field.max)) { result[field.name] = true; return; }
      var keys = fieldPairKeys(sourceFieldLabels(field, fieldLabel(field, ''), ''));
      keys.forEach(function (key) {
        if (!maximums[key] || maximums[key].length !== 1) return;
        result[field.name] = true;
        result[maximums[key][0].name] = true;
      });
    });
    return result;
  }

  function contractFieldItems(characterId, inspection, objects, rolls, readLive) {
    var result = { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    if (!inspection || inspection.status !== 'matched') return result;
    var fields = Array.isArray(inspection.contract.fields) ? inspection.contract.fields : [];
    if (!fields.length) return result;
    var index = contractRuntimeIndex(inspection.contract);
    var liveFields = liveResourceFields(fields);
    var fieldDefaults = dictionary();
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      if (own(field, 'default') && trim(field.default) !== '') fieldDefaults[field.name] = field.default;
    });
    readLive = readLive || cachedAttrReader(characterId);
    var attributes = objects || attrObjects(characterId);
    var attributeByName = dictionary();
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) attributeByName[name] = attribute;
    });
    var rowLabels = dictionary();
    (rolls || []).forEach(function (instance) {
      var repeating = instance.roll && contractRepeating(instance.roll);
      if (!instance.row || !repeating) return;
      var section = trim(repeating.section);
      var key = section + '|' + instance.row.id;
      if (!rowLabels[key] && trim(instance.label)) rowLabels[key] = trim(instance.label);
    });
    function fieldVisibility(match) {
      var condition = match.field && match.field.visibility;
      if (!condition) return true;
      return contractVisibilityResult(condition, function (name, atom) {
        var scope = trim(atom && atom.scope).toLowerCase();
        var fullName = name;
        if (scope !== 'global' && match.section && match.rowId)
          fullName = 'repeating_' + match.section + '_' + match.rowId + '_' + name;
        if (attributeByName[fullName])
          return { known: true, value: attributeByName[fullName].get('current') };
        var live = readLive(fullName, 'current');
        if (live !== undefined && live !== null && String(live) !== '')
          return { known: true, value: live };
        var sourceField = match.section && index.fieldSections[match.section]
          ? index.fieldSections[match.section][name]
          : index.fieldGlobal[name];
        if (sourceField && own(sourceField, 'default'))
          return { known: true, value: sourceField.default };
        var control = index.controls[name];
        return control && own(control, 'default')
          ? { known: true, value: control.default }
          : { known: false };
      });
    }
    function fieldRowContext(match) {
      if (!match.section || !match.rowId) return null;
      var fields = index.fieldSections[match.section] || dictionary();
      var prefix = 'repeating_' + match.section + '_' + match.rowId + '_';
      var values = dictionary();
      Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var fullName = prefix + name;
        var attribute = attributeByName[fullName];
        var current = attribute ? attribute.get('current') : undefined;
        var maximum = attribute ? attribute.get('max') : undefined;
        if ((current === undefined || trim(current) === '') && own(field, 'default')) current = field.default;
        if ((maximum === undefined || trim(maximum) === '') && trim(field.max)) maximum = field.max;
        if (current !== undefined && trim(current) !== '') values[fullName + '|current'] = current;
        if (maximum !== undefined && trim(maximum) !== '') values[fullName + '|max'] = maximum;
      });
      return { scopes: [prefix], fields: fields, values: values };
    }
    function add(match, attribute, fallback) {
      var field = match.field;
      if (!userFacingField(field)) return;
      var visible = fieldVisibility(match);
      if (visible === false) return;
      var fullName = match.name;
      var raw = attribute ? attribute.get('current') : fallback;
      var rowLabel = match.section ? rowLabels[match.section + '|' + match.rowId] || '' : '';
      var label = fieldLabel(field, rowLabel);
      var aliases = fieldAliases(field, label, rowLabel, fullName);
      var type = trim(field.type).toLowerCase();
      var sourceLabels = sourceFieldLabels(field, label, rowLabel);
      var rowContext = fieldRowContext(match);
      var number = /^(?:text|number|range)$/.test(type)
        ? numericFieldValue(characterId, raw, fieldDefaults, rowContext) : null;
      var tracked = !!field.trackCandidate && (number !== null || type === 'checkbox');
      if (tracked) result.tracked[fullName] = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        fieldLabel: localFieldLabel(field),
        kind: type === 'checkbox' ? 'toggle' : 'number',
        onValue: trim(field.onValue),
        value: raw,
        automationVisible: visible === true,
      };
      if (number === null) return;
      var maxRaw = attribute && attribute.get('max');
      if (trim(maxRaw) === '' && trim(field.max)) {
        var liveMax = readLive(fullName, 'max');
        if (liveMax !== undefined && liveMax !== null && trim(liveMax) !== '') maxRaw = liveMax;
      }
      if (trim(maxRaw) === '') maxRaw = field.max;
      var item = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        fieldLabel: localFieldLabel(field),
        value: number,
        max: numericFieldValue(characterId, maxRaw, fieldDefaults, rowContext),
        writable: !!field.numericCandidate,
        automationVisible: visible === true,
      };
      result.references.push(item);
      if (!field.numericCandidate) return;
      result.resources.push(item);
      result.byAttribute[fullName] = item;
      aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!result.aliases[key]) result.aliases[key] = [];
        result.aliases[key].push(item);
      });
    }
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      var name = trim(field.name);
      var attribute = attributeByName[name];
      if (attribute) add({ field: field, name: name, rowId: '' }, attribute);
      else if (!field.hidden && field.trackCandidate && trim(field.type).toLowerCase() === 'checkbox')
        add({ field: field, name: name, rowId: '' }, null, field.default);
      else if (!field.hidden && /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) && own(field, 'default')) {
        var fallback = field.default;
        if (liveFields[name]) {
          var live = readLive(name, 'current');
          if (live !== undefined && live !== null && trim(live) !== '') fallback = live;
        }
        add({ field: field, name: name, rowId: '' }, null, fallback);
      }
    });
    attributes.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (index.fieldGlobal[name]) return;
      var match = contractFieldMatch(index, name);
      if (match && match.section) add(match, attribute);
    });
    var maximumByKey = dictionary();
    result.references.forEach(function (candidate, index) {
      if (!maximumFieldLabel(candidate.sourceLabels)) return;
      fieldPairKeys(candidate.sourceLabels).forEach(function (key) {
        if (!maximumByKey[key]) maximumByKey[key] = [];
        maximumByKey[key].push({ candidate: candidate, index: index });
      });
    });
    result.resources.forEach(function (item) {
      if (item.max !== null) return;
      var scores = dictionary();
      var candidates = [];
      fieldPairKeys(item.sourceLabels).forEach(function (key) {
        (maximumByKey[key] || []).forEach(function (entry) {
          if (entry.candidate === item) return;
          if (!scores[entry.index]) candidates.push(entry);
          scores[entry.index] = (scores[entry.index] || 0) + 1;
        });
      });
      var best = 0;
      var match = null;
      var matchCount = 0;
      candidates.forEach(function (entry) {
        var score = scores[entry.index];
        if (score < best) return;
        if (score > best) {
          best = score;
          match = entry.candidate;
          matchCount = 1;
        } else matchCount += 1;
      });
      if (matchCount === 1) item.max = match.value;
    });
    result.resources.sort(function (left, right) {
      return left.label.localeCompare(right.label) || left.name.localeCompare(right.name);
    });
    return result;
  }

  function invalidate(characterId) {
    if (characterId) {
      delete cache[characterId];
      delete attributeObjectCache[characterId];
    } else {
      cache = {};
      attributeObjectCache = {};
      contractMatchCache = {};
    }
  }

  function scan(characterId, force) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    if (!force && cache[characterId] && cache[characterId].characterName === trim(character.get('name')))
      return cache[characterId];
    var objects = attrObjects(characterId);
    attributeObjectCache[characterId] = objects;
    var contractMatch = contractMatchCache[characterId] || inspectContracts(characterId, objects);
    var value = {};
    value.warnings = [];
    value.ok = true;
    value.profileId = 'sheet';
    value.score = contractMatch.match && contractMatch.match.score || 0;
    value.matched = contractMatch.status === 'matched';
    value.characterId = characterId;
    value.characterName = trim(character.get('name'));
    value.contractMatch = contractMatch;
    var readLive = cachedAttrReader(characterId);
    value.contractAllRolls = contractRolls(characterId, value.contractMatch, objects, true, readLive);
    value.contractRolls = value.contractAllRolls.filter(function (instance) { return !instance.hidden; });
    var fields = contractFieldItems(characterId, value.contractMatch, objects, value.contractRolls, readLive);
    value.resources = fields.resources;
    value.trackedFields = fields.tracked;
    value.resourceAliases = fields.aliases;
    value.resourcesByAttribute = fields.byAttribute;
    value.fieldReferences = fields.references;
    cache[characterId] = value;
    return value;
  }

  function scannedContractRolls(characterId, includeHidden) {
    var data = scan(characterId);
    return (includeHidden ? data.contractAllRolls : data.contractRolls) || [];
  }

  var DETECTED_ROLE_LABELS = {
    health: ['체력', 'hp', 'hitpoint', 'hitpoints'],
    sanity: ['이성', 'san', 'sanity'],
    startingSanity: ['시작이성', '초기이성', 'startingsanity', 'initialsanity'],
    majorWound: ['중상', 'majorwound'],
    dying: ['빈사', 'dying'],
    longInsanity: ['장기광기', '장기적광기', 'indefiniteinsanity', 'indefinsane'],
    temporaryInsanity: ['일시광기', '일시적광기', '단기광기', 'temporaryinsanity', 'tempinsane'],
    intelligence: ['지능', 'int', 'intelligence'],
  };

  function detectedLabelKeys(labels) {
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(contractDisplayLabel(label));
      var stripped = key
        .replace(/^(?:현재|current)/i, '')
        .replace(/(?:현재|current|값|수치|점수|value|score|체크|check)$/i, '');
      [key, stripped].forEach(function (candidate) {
        if (!candidate || seen[candidate]) return;
        seen[candidate] = true;
        result.push(candidate);
      });
    });
    return result;
  }

  function matchesDetectedRole(labels, role) {
    var wanted = DETECTED_ROLE_LABELS[role] || [];
    return detectedLabelKeys(labels).some(function (key) { return wanted.indexOf(key) > -1; });
  }

  function uniqueDetectedItems(items, role) {
    var seen = dictionary();
    var matches = (items || []).filter(function (item) {
      var labels = item && item.kind === 'toggle' && item.fieldLabel ? [item.fieldLabel] : item && item.sourceLabels;
      if (!item || item.automationVisible !== true || !matchesDetectedRole(labels, role) || seen[item.name]) return false;
      seen[item.name] = true;
      return true;
    });
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function detectedFieldRole(data, role, kind) {
    var items = kind === 'toggle'
      ? Object.keys(data.trackedFields || {}).map(function (name) { return data.trackedFields[name]; })
        .filter(function (item) { return item.kind === 'toggle'; })
      : (data.resources || []).filter(function (item) {
          return role === 'startingSanity' ||
            !/^(?:시작|start|초기|initial|최대|maximum|max)/i.test(normalize(item.fieldLabel));
        });
    return uniqueDetectedItems(items, role);
  }

  function detectedRollLabels(instance) {
    return [instance && instance.label, instance && instance.roll && instance.roll.label]
      .concat(instance && instance.roll && instance.roll.aliases || [])
      .concat((instance && instance.roll && instance.roll.staticLabels || []).map(function (entry) {
        return entry && entry.value;
      }));
  }

  function neutralSourceRoll(instance) {
    var roll = instance && instance.roll;
    if (!roll || (Array.isArray(instance.modes) && instance.modes.length)) return false;
    var diceFields = 0;
    String(roll.raw || '').replace(/\{\{\s*[^={}]+?\s*=\s*([^}]*)\}\}/g, function (token, value) {
      if (/\[\[[\s\S]*?\b\d*d\d+/i.test(value)) diceFields += 1;
      return token;
    });
    if (diceFields !== 1) return false;
    var template = instance.contract && instance.contract.resultTemplates &&
      instance.contract.resultTemplates[roll.template];
    var groups = dictionary();
    (template && Array.isArray(template.rules) ? template.rules : []).forEach(function (rule) {
      if (rule && own(rule, 'group')) groups[String(rule.group)] = true;
    });
    return Object.keys(groups).length <= 1;
  }

  function detectedRollRole(data, role) {
    var seen = dictionary();
    var matches = (data.contractRolls || []).filter(function (instance) {
      var key = instance && instance.key;
      if (!key || seen[key] || !matchesDetectedRole(detectedRollLabels(instance), role)) return false;
      seen[key] = true;
      return true;
    });
    if (matches.length > 1) {
      var neutral = matches.filter(neutralSourceRoll);
      if (neutral.length === 1) matches = neutral;
    }
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

 function canControl(character, playerId) {
    if (!character) return false;
    if (playerId === 'API' || playerIsGM(playerId)) return true;
    var controlled = trim(character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean);
    return controlled.indexOf('all') > -1 || controlled.indexOf(playerId) > -1;
  }

  function hasPlayerController(character) {
    return trim(character && character.get('controlledby'))
      .split(',')
      .map(trim)
      .filter(Boolean)
      .some(function (playerId) { return playerId === 'all' || !playerIsGM(playerId); });
  }

 function profileCharacters() {
    return characterObjects().filter(function (character) {
      var status = inspectContracts(character.id).status;
      return status === 'matched' || status === 'ambiguous';
    });
  }

  function resolveCharacterName(query, characters) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '캐릭터 이름을 입력해 주세요.' };
    characters = characters || profileCharacters();
    var exact = characters.filter(function (character) {
      return normalize(character.get('name')) === wanted;
    });
    if (exact.length === 1) return { ok: true, character: exact[0] };
    var partial = characters.filter(function (character) {
      return normalize(character.get('name')).indexOf(wanted) > -1;
    });
    if (partial.length === 1) return { ok: true, character: partial[0] };
    if (partial.length > 1)
      return {
        ok: false,
        error: '이름이 비슷한 캐릭터가 여러 명입니다: ' + partial.map(function (character) {
          return trim(character.get('name'));
        }).join(', '),
      };
    return { ok: false, error: '이름에 ' + trim(query) + '이(가) 들어간 캐릭터를 찾지 못했습니다.' };
  }

  function resolveCharacter(msg, explicitId) {
    if (!explicitId && msg && own(msg, '_kibSheetResolvedCharacter'))
      return msg._kibSheetResolvedCharacter;
    var resolved = resolveCharacterNow(msg, explicitId);
    if (!explicitId && msg) msg._kibSheetResolvedCharacter = resolved;
    return resolved;
  }

  function speakingCharacter(msg) {
    var player = getObj('player', msg && msg.playerid);
    var match = trim(player && player.get('speakingas')).match(/^character\|(.+)$/i);
    if (!match)
      return { ok: false, error: '채팅 입력창의 As를 사용할 캐릭터로 바꾼 뒤 다시 입력해 주세요.' };
    var character = getObj('character', match[1]);
    if (!character) return { ok: false, error: '현재 As 캐릭터를 찾지 못했습니다.' };
    return canControl(character, msg.playerid)
      ? { ok: true, character: character }
      : { ok: false, error: '현재 As 캐릭터를 조작할 권한이 없습니다.' };
  }

  function resolveCharacterNow(msg, explicitId) {
    if (explicitId) {
      var direct = getObj('character', explicitId);
      if (!direct) return { ok: false, error: '버튼에 기록된 캐릭터를 찾지 못했습니다.' };
      if (!canControl(direct, msg.playerid))
        return { ok: false, error: '이 캐릭터를 조작할 권한이 없습니다.' };
    }
    var speaking = speakingCharacter(msg);
    if (!speaking.ok) return speaking;
    if (explicitId && speaking.character.id !== explicitId)
      return { ok: false, error: '현재 As 캐릭터와 버튼에 기록된 캐릭터가 다릅니다. 현재 As의 현황을 다시 열어 주세요.' };
    return speaking;
  }

  function resolveInspectionCharacter(msg) {
    if (playerIsGM(msg.playerid)) {
      var managed = getObj('character', initState().managerCharacterId);
      if (managed) return { ok: true, character: managed };
    }
    return resolveCharacter(msg, '');
  }

  function ensureSheet(character) {
    var contractMatch = inspectContracts(character.id);
    if (contractMatch.status === 'ambiguous')
      return { ok: false, error: contractMatch.error };
    if (contractMatch.status !== 'matched')
      return {
        ok: false,
        error: SHEET_NOT_RECOGNIZED,
      };
    return { ok: true, data: scan(character.id) };
  }

  var OUTCOMES = {
    roll: '판정 실행',
    critical: '대성공',
    extreme: '극단적 성공',
    hard: '어려운 성공',
    success: '보통 성공',
    failure: '실패',
    fumble: '대실패',
  };

  function resultKey(system, label) {
    return normalize(system) + ':' + encodeURIComponent(normalize(label));
  }

  function contractCutinKey(instance) {
    return resultKey('sheet', instance.key);
  }

  function templateValue(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var match = content.match(new RegExp('\\{\\{\\s*' + escaped + '\\s*=\\s*([^}]*)\\}\\}', 'i'));
    if (!match) return null;
    var value = trim(match[1]);
    if (!value) return null;
    var inline = value.match(/^\$\[\[(\d+)\]\]$/);
    if (inline) {
      var roll = message.inlinerolls && message.inlinerolls[Number(inline[1])];
      var total = roll && roll.results && Number(roll.results.total);
      return isFinite(total) ? total : null;
    }
    var number = Number(value.replace(/^\[\[|\]\]$/g, ''));
    return isFinite(number) ? number : null;
  }

  function templateHasField(message, field) {
    var content = String((message && message.content) || '');
    var escaped = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp('\\{\\{\\s*' + escaped + '\\s*=', 'i').test(content);
  }

  function contractResultMode(message, payload) {
    var mode = 'normal';
    var modeLabel = normalize(payload && payload.modeLabel);
    if (/(?:보너스|bonus).*2/.test(modeLabel)) mode = 'bonus2';
    else if (/(?:보너스|bonus).*1/.test(modeLabel)) mode = 'bonus1';
    else if (/(?:패널티|페널티|penalty).*2/.test(modeLabel)) mode = 'penalty2';
    else if (/(?:패널티|페널티|penalty).*1/.test(modeLabel)) mode = 'penalty1';
    var diceType = templateValue(message, 'dice_type');
    if (mode === 'normal') {
      if (diceType === 1) mode = 'bonus1';
      else if (diceType === 2) mode = 'bonus2';
      else if (diceType === -1) mode = 'penalty1';
      else if (diceType === -2) mode = 'penalty2';
    }
    return mode;
  }

  function sourceResultTemplate(payload) {
    if (!payload || !payload.contractId || !payload.key) return null;
    var contracts = sheetContracts();
    for (var i = 0; i < contracts.length; i += 1) {
      var contract = contracts[i];
      if (String(contract.id) !== String(payload.contractId) || !contract.resultTemplates) continue;
      var roll = contract.rolls.filter(function (item) {
        return item && String(item.key) === String(payload.key);
      })[0];
      if (!roll || !roll.template) return null;
      if (contract.resultTemplates[roll.template]) return contract.resultTemplates[roll.template];
      var wanted = normalize(roll.template);
      var names = Object.keys(contract.resultTemplates);
      for (var index = 0; index < names.length; index += 1) {
        if (normalize(names[index]) === wanted) return contract.resultTemplates[names[index]];
      }
      return null;
    }
    return null;
  }

  function sourceResultOperand(message, value) {
    var raw = trim(value);
    if (/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(raw)) return Number(raw);
    return templateValue(message, raw);
  }

  function sourceResultCondition(message, condition) {
    if (!condition || !Array.isArray(condition.args) || !condition.args.length) return false;
    var matched = false;
    if (condition.op === 'present') matched = templateHasField(message, condition.args[0]);
    else {
      var left = sourceResultOperand(message, condition.args[0]);
      if (left === null) matched = false;
      else if (condition.op === 'eq') {
        var right = sourceResultOperand(message, condition.args[1]);
        matched = right !== null && left === right;
      } else if (condition.op === 'gt') {
        var greater = sourceResultOperand(message, condition.args[1]);
        matched = greater !== null && left > greater;
      } else if (condition.op === 'lt') {
        var less = sourceResultOperand(message, condition.args[1]);
        matched = less !== null && left < less;
      } else if (condition.op === 'between') {
        var lower = sourceResultOperand(message, condition.args[1]);
        var upper = sourceResultOperand(message, condition.args[2]);
        matched = lower !== null && upper !== null && left >= lower && left <= upper;
      }
    }
    return condition.not ? !matched : matched;
  }

  function sourceResultGroupMatches(group, mode) {
    var expected = mode === 'bonus2' ? '+2'
      : mode === 'bonus1' ? '+1'
        : mode === 'penalty2' ? '-2'
          : mode === 'penalty1' ? '-1'
            : '0';
    return String(group) === expected;
  }

  function sourceContractResult(message, payload, mode) {
    var template = sourceResultTemplate(payload);
    var rules = template && Array.isArray(template.rules) ? template.rules : [];
    if (!rules.length) return null;
    var grouped = rules.some(function (rule) { return own(rule, 'group'); });
    for (var i = 0; i < rules.length; i += 1) {
      var rule = rules[i];
      if (!rule || !OUTCOMES[rule.outcome] || !Array.isArray(rule.conditions)) continue;
      if (grouped && (!own(rule, 'group') || !sourceResultGroupMatches(rule.group, mode))) continue;
      if (!rule.conditions.every(function (condition) { return sourceResultCondition(message, condition); })) continue;
      var total = templateValue(message, rule.valueField);
      if (total === null) continue;
      return { total: total, outcome: rule.outcome, outcomeLabel: OUTCOMES[rule.outcome] };
    }
    return null;
  }

 function contractResult(message, payload) {
    var target = templateValue(message, 'success');
    var hard = templateValue(message, 'hard');
    var extreme = templateValue(message, 'extreme');
    var critical = templateValue(message, 'critical');
    var fumble = templateValue(message, 'fumble');
    var mode = contractResultMode(message, payload);
    var sourceOutcome = sourceContractResult(message, payload, mode);
    if (sourceOutcome) {
      sourceOutcome.target = target;
      sourceOutcome.hard = hard;
      sourceOutcome.extreme = extreme;
      sourceOutcome.mode = mode;
      return sourceOutcome;
    }
    var roll1 = templateValue(message, 'roll1');
    var roll2 = templateValue(message, 'roll2');
    var roll3 = templateValue(message, 'roll3');
    var rolled = templateValue(message, 'roll');
    if (mode === 'normal' && rolled === null) rolled = roll1;
    if (mode === 'bonus1') rolled = roll1 !== null && roll2 !== null ? Math.min(roll1, roll2) : null;
    else if (mode === 'bonus2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.min(roll1, roll2, roll3) : null;
    else if (mode === 'penalty1') rolled = roll1 !== null && roll2 !== null ? Math.max(roll1, roll2) : null;
    else if (mode === 'penalty2') rolled = roll1 !== null && roll2 !== null && roll3 !== null ? Math.max(roll1, roll2, roll3) : null;
    if (target === null) {
      var genericTotal = rolled;
      if (genericTotal === null && message && Array.isArray(message.inlinerolls) && message.inlinerolls.length) {
        var firstTotal = message.inlinerolls[0] && message.inlinerolls[0].results && Number(message.inlinerolls[0].results.total);
        genericTotal = isFinite(firstTotal) ? firstTotal : null;
      }
      return genericTotal === null ? null : { total: genericTotal, outcome: 'roll', outcomeLabel: OUTCOMES.roll };
    }
    if (rolled === null) return null;
    var outcome = 'failure';
    if (critical !== null && rolled <= critical) outcome = 'critical';
    else if (fumble !== null && rolled >= fumble) outcome = 'fumble';
    else if (extreme !== null && rolled <= extreme) outcome = 'extreme';
    else if (hard !== null && rolled <= hard) outcome = 'hard';
    else if (rolled <= target) outcome = 'success';
    return {
      total: rolled,
      target: target,
      hard: hard,
      extreme: extreme,
      mode: mode,
      outcome: outcome,
      outcomeLabel: OUTCOMES[outcome],
    };
  }

  function emitResult(payload, message) {
    var result = payload.contractId ? contractResult(message, payload) : null;
    if (result) {
      payload.result = result;
      payload.outcome = result.outcome;
      payload.outcomeLabel = result.outcomeLabel;
    }
    var automaticInsanity = payload._automaticInsanity;
    delete payload._automaticInsanity;
    if (automaticInsanity) finishAutomaticInsanity(payload, result, automaticInsanity);
    payload.message = message || null;
    if (typeof KIBScene.broadcast === 'function')
      KIBScene.broadcast('sheet:result', payload);
    else {
      var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
      var listener = cutin && cutin.events && cutin.events['sheet:result'];
      if (typeof listener === 'function') listener(payload);
    }
  }

  function prunePendingResults() {
    var cutoff = Date.now() - 30000;
    Object.keys(pendingResults).forEach(function (token) {
      if (pendingResults[token].created < cutoff) delete pendingResults[token];
    });
  }

  function messageTemplateFields(message) {
    var fields = dictionary();
    String(message && message.content || '').replace(/\{\{\s*([^={}]+?)\s*=\s*([^}]*)\}\}/g, function (token, name, value) {
      fields[trim(name).toLowerCase()] = trim(value);
      return token;
    });
    return fields;
  }

  function sourceTemplateFieldNames(raw) {
    var found = dictionary();
    String(raw || '').replace(/\{\{\s*([^={}]+?)\s*=/g, function (token, name) {
      found[trim(name).toLowerCase()] = true;
      return token;
    });
    return Object.keys(found);
  }

  function normalizedTemplateText(value) {
    return normalize(String(value == null ? '' : value).replace(/<[^>]*>/g, ' '));
  }

  function directResultCharacters(message, fields) {
    var speaking = speakingCharacter(message);
    return speaking.ok ? [speaking.character] : [];
  }

  function directInstanceScore(characterId, instance, fields) {
    var roll = instance.roll || {};
    var score = 0;
    var rejected = false;
    var hasIdentity = false;
    var matchedIdentity = false;
    (Array.isArray(roll.staticLabels) ? roll.staticLabels : []).forEach(function (entry) {
      if (rejected || !entry || typeof entry !== 'object' || !entry.field) return;
      hasIdentity = true;
      var field = trim(entry.field).toLowerCase();
      if (!own(fields, field)) return;
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(entry.value)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
      if (rejected || !ref || !ref.field) return;
      hasIdentity = true;
      var field = trim(ref.field).toLowerCase();
      if (!own(fields, field)) return;
      var expected = contractLabelRef(characterId, instance.contract, roll, instance.row, ref);
      if (normalizedTemplateText(fields[field]) !== normalizedTemplateText(expected)) rejected = true;
      else {
        matchedIdentity = true;
        score += 20;
      }
    });
    if (rejected || (hasIdentity && !matchedIdentity)) return -1;
    sourceTemplateFieldNames(roll.raw).forEach(function (field) {
      if (own(fields, field)) score += 1;
    });
    var values = dictionary();
    Object.keys(fields).forEach(function (field) {
      var value = normalizedTemplateText(fields[field]);
      if (value) values[value] = true;
    });
    (instance.aliases || []).forEach(function (alias) {
      if (values[normalize(alias)]) score += 3;
    });
    return score;
  }

  function directInstanceIdentity(instance) {
    var roll = instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(roll.name),
      normalize(roll.template),
      normalize(instance.label),
      repeating && repeating.section || '',
      instance.row && instance.row.id || '',
      roll.staticLabels || [],
      roll.labelRefs || [],
    ]);
  }

  function captureDirectResult(message) {
    if (!message || !message.rolltemplate || !Array.isArray(message.inlinerolls)) return false;
    var fields = messageTemplateFields(message);
    var matches = [];
    directResultCharacters(message, fields).forEach(function (character) {
      var data = scan(character.id);
      if (!data.ok || !data.contractMatch) return;
      var instances = data.contractMatch.status === 'matched'
        ? data.contractRolls
        : actionableContractRolls(character.id, data.contractMatch, false);
      var template = normalize(message.rolltemplate);
      instances.forEach(function (instance) {
        if (normalize(instance.roll && instance.roll.template) !== template) return;
        var score = directInstanceScore(character.id, instance, fields);
        if (score > 0) matches.push({ character: character, instance: instance, score: score });
      });
    });
    if (!matches.length) return false;
    var bestScore = Math.max.apply(Math, matches.map(function (match) { return match.score; }));
    var best = matches.filter(function (match) { return match.score === bestScore; });
    var keys = dictionary();
    best.forEach(function (match) { keys[contractCutinKey(match.instance)] = true; });
    if (Object.keys(keys).length !== 1) {
      var identities = dictionary();
      best.forEach(function (match) { identities[directInstanceIdentity(match.instance)] = true; });
      if (Object.keys(identities).length !== 1) return false;
    }
    var match = best[0];
    emitResult({
      source: 'sheet',
      system: 'sheet',
      kind: match.instance.roll.kind || 'contract',
      characterId: match.character.id,
      contractId: match.instance.contract.id,
      sourceHash: match.instance.contract.sourceHash || '',
      key: match.instance.roll.key,
      label: match.instance.label,
      aliases: match.instance.aliases || [],
      cutinKey: contractCutinKey(match.instance),
      mode: '',
      modeLabel: '',
      secret: message.type === 'whisper' || message.type === 'gmrollresult',
    }, message);
    return true;
  }

  function captureResult(message) {
    var content = String((message && message.content) || '');
    var tokenMatch = content.match(/\{\{\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*\}\}/i);
    if (tokenMatch && pendingResults[tokenMatch[1]]) {
      var pending = pendingResults[tokenMatch[1]];
      delete pendingResults[tokenMatch[1]];
      emitResult(pending.payload, message);
      return true;
    }
    return captureDirectResult(message);
  }

  function merge(target, source) {
    Object.keys(source || {}).forEach(function (key) {
      target[key] = source[key];
    });
    return target;
  }

  function sendSheet(character, content, payload) {
    prunePendingResults();
    var token = 'k' + Date.now().toString(36) + randomInteger(1000000000).toString(36);
    pendingResults[token] = { created: Date.now(), payload: payload };
    try {
      sendChat('character|' + character.id, content + ' {{kib_sheet_result=' + token + '}}');
      return { ok: true, payload: payload };
    } catch (err) {
      delete pendingResults[token];
      return { ok: false, error: '판정 메시지를 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function sourceContractAction(character, query, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    var resolved = resolveContractAction(character, query, secret);
    return resolved.handled
      ? resolved.result
      : { ok: false, error: '현재 시트에서 ' + trim(query) + ' 굴림을 찾지 못했습니다.' };
  }

  function sourceContractNeedsName(character) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'none') return null;
    if (inspection.status === 'ambiguous') return { ok: false, error: inspection.error };
    return { ok: false, error: '시트에서 읽은 굴림은 <code>!!굴릴항목이름</code>으로 실행해 주세요.' };
  }

  function rollCheck(characterId, query, options) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, trim(query) + (options && trim(options.mode) ? ' ' + trim(options.mode) : ''), !!(options && options.secret));
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function safeRollExpression(expression) {
    var source = trim(expression);
    if (!source || source.length > 100) return null;
    var scrubbed = source.replace(/@\{[A-Za-z0-9_$-]+(?:\|max)?\}/g, '1');
    if (scrubbed.indexOf('@{') > -1) return null;
    var withoutFunctions = scrubbed.replace(/\b(?:floor|ceil|round|min|max|abs)\b/gi, '');
    if (!/^[\d\s+dD*/().,-]+$/.test(withoutFunctions)) return null;
    var dice = scrubbed.match(/(?:\d*)d\d+/gi) || [];
    for (var i = 0; i < dice.length; i++) {
      var match = dice[i].match(/^(\d*)d(\d+)$/i);
      var count = Number(match[1] || 1);
      var sides = Number(match[2]);
      if (count < 1 || count > 100 || sides < 1 || sides > 100000) return null;
    }
    return source;
  }

  function safeUserRollExpression(characterId, expression) {
    var resolved = resolvedRollExpression(characterId, expression, [], 0, {});
    if (!resolved) return null;
    if (!/(^|[^A-Za-z0-9_])(?:\d*)d\d+([^A-Za-z0-9_]|$)/i.test(resolved)) return null;
    var source = resolved.replace(/\s+/g, '');
    var tokens = [];
    while (source) {
      var match = source.match(/^(floor|ceil|round|min|max|abs|\d*d\d+|\d+(?:\.\d+)?|[()+\-*\/,])/i);
      if (!match) return null;
      tokens.push(match[1]);
      source = source.substring(match[1].length);
    }
    var depth = 0;
    var expectingValue = true;
    var unary = false;
    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];
      if (/^(?:floor|ceil|round|min|max|abs)$/i.test(token)) {
        if (!expectingValue || tokens[i + 1] !== '(') return null;
        continue;
      }
      if (token === '(') {
        if (!expectingValue) return null;
        depth++;
        unary = false;
        continue;
      }
      if (token === ')') {
        if (expectingValue || depth < 1) return null;
        depth--;
        expectingValue = false;
        unary = false;
        continue;
      }
      if (token === ',') {
        if (expectingValue || depth < 1) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (/^[+\-]$/.test(token) && expectingValue) {
        if (unary) return null;
        unary = true;
        continue;
      }
      if (/^[+\-*\/]$/.test(token)) {
        if (expectingValue) return null;
        expectingValue = true;
        unary = false;
        continue;
      }
      if (!expectingValue) return null;
      expectingValue = false;
      unary = false;
    }
    return !expectingValue && depth === 0 ? resolved : null;
  }

  function repeatingScope(name) {
    var match = trim(name).match(/^(repeating_.+_(?:\$\d+|-[A-Za-z0-9_-]+)_)/);
    return match ? [match[1]] : [];
  }

  function expressionAttribute(characterId, name, valueType, scopes, defaults, rowContext) {
    var candidates = [];
    var rowLocal = rowContext && rowContext.fields && own(rowContext.fields, name);
    if (name.indexOf('repeating_') !== 0) {
      (scopes || []).forEach(function (scope) {
        candidates.push({ name: scope + name, scopes: scopes });
      });
    }
    if (!rowLocal) candidates.push({ name: name, scopes: repeatingScope(name) });
    for (var i = 0; i < candidates.length; i++) {
      var valueKey = candidates[i].name + '|' + valueType;
      var value = rowLocal && rowContext.values && own(rowContext.values, valueKey)
        ? rowContext.values[valueKey]
        : rowLocal ? undefined : getAttr(characterId, candidates[i].name, valueType);
      if ((value === undefined || trim(value) === '') && defaults && own(defaults, candidates[i].name))
        value = defaults[candidates[i].name];
      if (value !== undefined && trim(value) !== '')
        return { name: candidates[i].name, value: value, scopes: candidates[i].scopes };
    }
    return null;
  }

  function resolvedRollExpression(characterId, expression, scopes, depth, trail, defaults, rowContext) {
    if ((depth || 0) > 8) return null;
    var source = trim(expression);
    if (!source) return null;
    var failed = false;
    source = source.replace(/@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g, function (match, name, valueType) {
      var found = expressionAttribute(characterId, name, valueType || 'current', scopes || [], defaults, rowContext);
      if (!found || (trail && trail[found.name])) {
        failed = true;
        return '0';
      }
      var nextTrail = dictionary();
      Object.keys(trail || {}).forEach(function (key) { nextTrail[key] = true; });
      nextTrail[found.name] = true;
      var nested = resolvedRollExpression(
        characterId,
        found.value,
        found.scopes,
        (depth || 0) + 1,
        nextTrail,
        defaults,
        rowContext,
      );
      if (!nested) {
        failed = true;
        return '0';
      }
      return '(' + nested + ')';
    });
    if (failed || source.indexOf('@{') > -1) return null;
    return safeRollExpression(source);
  }

  function rollWeapon(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function showSpell(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollArmor(characterId, query, secret) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = sourceContractAction(character, query, secret);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

  function rollFree(characterId, secret, expressionOverride) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var sourceResult = expressionOverride !== undefined
      ? executeContractExpression(character, expressionOverride, secret)
      : sourceContractNeedsName(character);
    return sourceResult || { ok: false, error: SHEET_NOT_RECOGNIZED };
  }

 function contractChoice(instance, mode, secret, expression) {
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    return {
      kind: 'contract',
      characterId: instance.characterId,
      contractId: instance.contract.id,
      rollKey: instance.roll.key,
      rowId: instance.row ? instance.row.id : '',
      modeId: mode ? String(mode.id || '') : '',
      label: (instance.label || '시트 굴림') + (modeLabels.length ? ' / ' + modeLabels[0] : ''),
      secret: !!secret,
      expression: expression || '',
    };
  }

  function contractConflict(instances, secret, expression) {
    var entries = instances.slice(0, 50);
    var choices = entries.map(function (entry) {
      return contractChoice(entry.instance, entry.mode || null, secret, expression);
    });
    var counts = dictionary();
    choices.forEach(function (choice) {
      var key = normalize(choice.label);
      counts[key] = (counts[key] || 0) + 1;
    });
    var used = dictionary();
    choices.forEach(function (choice, index) {
      var key = normalize(choice.label);
      if (counts[key] < 2) return;
      used[key] = (used[key] || 0) + 1;
      choice.label += ' (선택 ' + used[key] + ')';
    });
    return {
      ok: false,
      reason: 'conflict',
      error: '시트 원본에서 맞는 실행 항목이 여러 개입니다.' + (instances.length > choices.length ? ' 먼저 50개만 표시합니다.' : ''),
      choices: choices,
    };
  }

  function replaceContractQueries(source, queries) {
    var value = source;
    var consumed = dictionary();
    (queries || []).filter(function (query) { return !!query.raw; }).sort(function (left, right) {
      return right.raw.length - left.raw.length || left.occurrence - right.occurrence;
    }).forEach(function (query) {
      var used = consumed[query.raw] || 0;
      var wanted = Math.max(1, query.occurrence - used);
      var start = 0;
      var found = -1;
      for (var index = 0; index < wanted; index++) {
        found = value.indexOf(query.raw, start);
        if (found < 0) break;
        start = found + query.raw.length;
      }
      if (found > -1) value = value.slice(0, found) + query.value + value.slice(found + query.raw.length);
      consumed[query.raw] = used + 1;
    });
    var grouped = dictionary();
    (queries || []).filter(function (query) { return !query.raw && query.name; }).forEach(function (query) {
      var key = normalize(query.name);
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(query);
    });
    var seen = dictionary();
    return value.replace(/\?\{([^{}]*)\}/g, function (match, content) {
      var key = normalize(trim(content.split('|')[0]));
      seen[key] = (seen[key] || 0) + 1;
      var selected = (grouped[key] || []).filter(function (query) {
        return query.occurrence === seen[key];
      })[0];
      return selected ? selected.value : match;
    });
  }

  function qualifyContractMacro(characterId, instance, mode, expression) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    if (!raw || raw.length > 20000) return { ok: false, error: '시트의 굴림 값이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(raw)) return { ok: false, error: 'API 명령을 실행하는 시트 굴림은 대신 실행하지 않습니다.' };
    if (/\{\{\s*kib_sheet_result\s*=/i.test(raw)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (/%\{\s*(?:selected|target)\|/i.test(raw))
      return { ok: false, error: 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.' };
    if (mode && !contractOverridesValid(instance.contract, instance.roll, mode))
      return { ok: false, error: '현재 시트의 선택 방식이 굴림에 맞지 않습니다.' };
    var overrides = contractOverrides(mode);
    var expressionRefs = Array.isArray(instance.roll.expressionRefs) ? instance.roll.expressionRefs : [];
    if (expression !== undefined) {
      expressionRefs.forEach(function (ref) {
        var name = contractRefName(ref);
        if (name) overrides[name] = expression;
      });
    }
    raw = replaceContractQueries(raw, contractQueries(mode));
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = null;
    var failed = '';
    var expansions = 0;
    function savedAttribute(name) {
      if (!savedAttributes) {
        savedAttributes = dictionary();
        (attributeObjectCache[characterId] || attrObjects(characterId)).forEach(function (attribute) {
          savedAttributes[trim(attribute.get('name'))] = attribute;
        });
      }
      return savedAttributes[name] || null;
    }
    function sourceValue(name, maximum) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var value = field && field[maximum ? 'max' : 'default'];
      if ((value === undefined || value === null || trim(value) === '') && !maximum) {
        var control = sourceControls[name] || runtimeIndex.controls[name];
        value = control && control.default;
      }
      if ((value === undefined || value === null || trim(value) === '') && !maximum && field && field.type === 'checkbox')
        value = '0';
      return value === undefined || value === null || trim(value) === '' ? null : String(value);
    }
    function missingValueError(name) {
      var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
      var label = field && userFacingField(field) ? fieldLabel(field, '') : '';
      var rollLabel = contractDisplayLabel(instance.label) || '선택한';
      return label && normalize(label) !== normalize(rollLabel)
        ? rollLabel + ' 굴림에 필요한 ' + label + ' 값이 비어 있습니다.'
        : rollLabel + ' 굴림에 필요한 수치가 비어 있습니다.';
    }
    function expand(fragment, depth, trail, required) {
      if (failed) return '';
      if (depth > 12) {
        failed = '시트 항목 연결이 너무 깊습니다.';
        return '';
      }
      var source = String(fragment);
      if (source.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      var expanded = source.replace(/@\{([^{}]+)\}/g, function (match, body, offset) {
        if (failed) return '';
        if (++expansions > 512) {
          failed = '시트 항목 연결이 너무 복잡합니다.';
          return '';
        }
        var parts = body.split('|').map(trim);
        var keyword = normalize(parts[0]);
        if (keyword === 'selected' || keyword === 'target') {
          failed = 'selected 또는 target이 필요한 롤은 토큰 대상이 없는 API에서 바로 실행할 수 없습니다.';
          return '';
        }
        var local = parts.length === 1 || (parts.length === 2 && normalize(parts[1]) === 'max');
        if (!local) {
          failed = '현재 캐릭터 외 속성을 참조하는 롤은 실행하지 않습니다.';
          return '';
        }
        var name = parts[0];
        var maximum = parts.length === 2;
        var requiredHere = required || source.lastIndexOf('[[', offset) > source.lastIndexOf(']]', offset);
        if (!maximum && own(overrides, name)) {
          if (requiredHere && trim(overrides[name]) === '') {
            failed = missingValueError(name);
            return '';
          }
          if (trail[name]) {
            failed = '시트 항목 연결이 순환합니다: ' + name;
            return '';
          }
          var nextTrail = dictionary();
          Object.keys(trail).forEach(function (key) { nextTrail[key] = true; });
          nextTrail[name] = true;
          return expand(overrides[name], depth + 1, nextTrail, requiredHere);
        }
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var actual = getAttr(characterId, fullName, maximum ? 'max' : 'current');
        var stored = actual === undefined || actual === null || trim(actual) === '' || trim(actual) === '0'
          ? savedAttribute(fullName) : null;
        if (stored) actual = stored.get(maximum ? 'max' : 'current');
        if (actual !== undefined && actual !== null && trim(actual) !== '' && /@\{[^{}]+\}/.test(String(actual))) {
          var attrKey = 'attr|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[attrKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var attrTrail = dictionary();
          Object.keys(trail).forEach(function (key) { attrTrail[key] = true; });
          attrTrail[attrKey] = true;
          return expand(actual, depth + 1, attrTrail, requiredHere);
        }
        if (actual !== undefined && actual !== null && trim(actual) !== '') return String(actual);
        if (stored) {
          var savedField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
          if (savedField && savedField.type === 'checkbox') return '0';
          if (!savedField || !savedField.hidden) {
            if (requiredHere) failed = missingValueError(name);
            return '';
          }
        }
        var fallback = sourceValue(name, maximum);
        if (fallback !== null) {
          var fallbackKey = 'default|' + fullName + '|' + (maximum ? 'max' : 'current');
          if (trail[fallbackKey]) {
            failed = '시트 항목 연결이 순환합니다: ' + fullName;
            return '';
          }
          var fallbackTrail = dictionary();
          Object.keys(trail).forEach(function (key) { fallbackTrail[key] = true; });
          fallbackTrail[fallbackKey] = true;
          return expand(fallback, depth + 1, fallbackTrail, requiredHere);
        }
        if (requiredHere) failed = missingValueError(name);
        return '';
      });
      if (expanded.length > 20000) {
        failed = '확장된 시트 롤이 너무 깁니다.';
        return '';
      }
      return expanded;
    }
    var content = expand(raw, 0, {}, false);
    if (failed) return { ok: false, error: failed };
    if (!content || content.length > 20000) return { ok: false, error: '확장된 시트 롤이 비어 있거나 너무 깁니다.' };
    if (/(^|[\r\n])\s*!/.test(content) || /%\{[^{}]+\}/.test(content))
      return { ok: false, error: '다른 능력 또는 API 명령을 불러오는 롤은 안전하게 재생할 수 없습니다.' };
    if (/\{\{\s*kib_sheet_result\s*=/i.test(content)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (content.indexOf('?{') > -1)
      return { ok: false, reason: 'query', error: '이 굴림은 시트에서 고르는 값이 더 필요합니다.' };
    return { ok: true, content: content };
  }

  function currentContractModes(characterId, instance) {
    var index = contractRuntimeIndex(instance.contract);
    var controls = index.rollControls[instance.roll.key] || index.controls;
    return (instance.modes || []).filter(function (mode) {
      var overrides = contractOverrides(mode);
      return Object.keys(overrides).every(function (name) {
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var current = getAttr(characterId, fullName);
        var control = controls[name];
        if ((current === undefined || current === null || String(current) === '') && control && own(control, 'default'))
          current = control.default;
        return current === undefined || current === null || String(current) === String(overrides[name]);
      });
    });
  }

  function executeContractInstance(character, instance, modeId, secret, expression, modeLabelOverride) {
    instance.characterId = character.id;
    var modes = instance.modes || [];
    var mode = null;
    if (modeId) {
      var matchingModes = modes.filter(function (candidate) { return String(candidate.id || '') === String(modeId); });
      if (matchingModes.length !== 1)
        return { ok: false, error: '선택한 굴림 방식이 바뀌었습니다. 항목을 다시 선택해 주세요.' };
      mode = matchingModes[0];
    }
    var qualified = qualifyContractMacro(character.id, instance, mode, expression);
    if (!qualified.ok) {
      if (qualified.reason === 'query' && !mode && modes.length) {
        var choices = currentContractModes(character.id, instance).filter(function (candidate) {
          return contractQueries(candidate).length > 0;
        });
        if (choices.length === 1)
          return executeContractInstance(character, instance, choices[0].id, secret, expression, modeLabelOverride);
        if (choices.length > 1)
          return contractConflict(choices.map(function (candidate) { return { instance: instance, mode: candidate }; }), secret, expression);
        return { ok: false, error: '현재 시트에서 같은 굴림 방식을 찾지 못했습니다.' };
      }
      return qualified;
    }
    var label = instance.label;
    var modeLabels = mode ? contractUserModeLabels(mode) : [];
    var content = qualified.content;
    var system = 'sheet';
    if (secret && !/^\s*\/(?:w|gmroll)\b/i.test(content)) content = '/w gm ' + content;
    var payload = {
      source: 'helper',
      system: system,
      kind: instance.roll.kind || 'contract',
      characterId: character.id,
      contractId: instance.contract.id,
      sourceHash: instance.contract.sourceHash || '',
      key: instance.roll.key,
      label: label,
      aliases: instance.aliases || [],
      cutinKey: contractCutinKey(instance),
      mode: mode ? String(mode.id || '') : normalize(modeLabelOverride),
      modeLabel: trim(modeLabelOverride) || modeLabels[0] || '',
      secret: !!secret,
    };
    if (/&\{\s*template\s*:/i.test(content)) return sendSheet(character, content, payload);
    try {
      sendChat('character|' + character.id, content);
      payload.resultTracking = false;
      return { ok: true, payload: payload };
    } catch (err) {
      return { ok: false, error: '시트 롤을 보내지 못했습니다: ' + (err.message || err) };
    }
  }

  function exactContractInstance(characterId, contractId, rollKey, rowId, includeHidden) {
    var inspection = inspectContracts(characterId);
    if (inspection.status !== 'matched' &&
        !(inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'))
      return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
    var allowed = inspection.status === 'matched'
      ? [inspection.contract.id]
      : (inspection.matches || []).map(function (match) { return match.id; });
    if (allowed.indexOf(String(contractId)) < 0)
      return { ok: false, error: '선택한 굴림 정보가 현재 캐릭터와 더 이상 맞지 않습니다.' };
    var matches = actionableContractRolls(characterId, inspection, !!includeHidden).filter(function (instance) {
      return String(instance.contract.id) === String(contractId) &&
        String(instance.roll.key) === String(rollKey) && String(instance.row ? instance.row.id : '') === String(rowId || '');
    });
    return matches.length === 1
      ? { ok: true, instance: matches[0] }
      : { ok: false, error: '선택한 굴림 또는 반복행이 바뀌었습니다.' };
  }

  function contractExpressionRef(characterId, instance) {
    var refs = instance && instance.roll && Array.isArray(instance.roll.expressionRefs)
      ? instance.roll.expressionRefs : [];
    if (refs.length !== 1) return '';
    var name = contractRefName(refs[0]);
    var control = contractControls(instance.contract, instance.roll).filter(function (candidate) {
      return contractControlName(candidate) === name;
    })[0];
    var type = trim(control && control.type).toLowerCase();
    if (!name || (type !== 'text' && type !== 'textarea')) return '';
    var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
    var value = getAttr(characterId, fullName);
    if ((value === undefined || value === null || String(value) === '') && control && own(control, 'default'))
      value = control.default;
    value = trim(value);
    if (value && !safeUserRollExpression(characterId, value)) return '';
    return name;
  }

  function executeContract(characterId, contractId, rollKey, rowId, modeId, secret, expressionText) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var exact = exactContractInstance(characterId, contractId, rollKey, rowId, !!modeId);
    if (!exact.ok) return exact;
    var expression;
    if (expressionText !== undefined && expressionText !== '') {
      if (!contractExpressionRef(characterId, exact.instance))
        return { ok: false, error: '선택한 굴림은 자유 주사위 식을 받지 않습니다.' };
      expression = safeUserRollExpression(characterId, expressionText);
      if (!expression) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    }
    return executeContractInstance(character, exact.instance, modeId, secret, expression);
  }

  function contractInstanceAliases(instance, compatible) {
    var found = dictionary();
    var result = [];
    (instance.aliases || []).forEach(function (value) {
      contractLookupKeys(value, compatible).forEach(function (key) {
        if (!found[key]) {
          found[key] = true;
          result.push(key);
        }
      });
    });
    return result;
  }

  function contractLookupKeys(value, compatible) {
    var key = normalize(value);
    if (!key) return [];
    if (compatible === false) return [key];
    var canonical = key.replace(/페널티/g, '패널티')
      .replace(/(?:주사위|dice)/g, '')
      .replace(/(\d)개/g, '$1')
      .replace(/개(?=\d)/g, '');
    return canonical === key || !canonical ? [key] : [key, canonical];
  }

  function contractModeCandidates(instance, compatible) {
    var actionAliases = contractInstanceAliases(instance, compatible);
    var result = [];
    (instance.modes || []).forEach(function (mode) {
      var modeAliases = [];
      contractUserModeLabels(mode).forEach(function (label) {
        modeAliases = modeAliases.concat(contractLookupKeys(label, compatible));
      });
      var combined = [];
      actionAliases.forEach(function (action) {
        modeAliases.forEach(function (modeAlias) { combined.push(action + modeAlias); });
      });
      result.push({ instance: instance, mode: mode, exactValues: modeAliases.concat(combined), partialValues: combined });
    });
    return result;
  }

  function contractKeysMatch(values, wanted, partial) {
    return values.some(function (value) {
      return wanted.some(function (key) {
        return partial ? value.indexOf(key) > -1 : value === key;
      });
    });
  }

  function contractMatchRank(values, wanted) {
    var best = 3;
    values.forEach(function (value) {
      wanted.forEach(function (key) {
        if (value === key) best = 0;
        else if (best > 1 && value.indexOf(key) === 0) best = 1;
        else if (best > 2 && value.indexOf(key) > -1) best = 2;
      });
    });
    return best;
  }

  function closestContractActions(instances, query, includeHidden) {
    var wanted = contractLookupKeys(query, true);
    var best = 3;
    var found = [];
    instances.forEach(function (instance) {
      if (instance.hidden && !includeHidden) return;
      var rank = contractMatchRank(contractInstanceAliases(instance, true), wanted);
      if (rank < best) {
        best = rank;
        found = [instance];
      } else if (rank === best) found.push(instance);
    });
    return best < 3 ? found : [];
  }

  function uniqueContractCandidates(candidates) {
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key + '|' +
        String(candidate.mode && candidate.mode.id || '');
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function collapseEquivalentContractCandidates(characterId, candidates, expression) {
    if (candidates.length < 2) return candidates;
    var firstContractId = candidates[0].instance.contract.id;
    if (candidates.every(function (candidate) {
      return candidate.instance.contract.id === firstContractId;
    })) return candidates;
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var instance = candidate.instance;
      var mode = candidate.mode || null;
      var qualified = qualifyContractMacro(characterId, instance, mode, expression);
      var resultTemplate = sourceResultTemplate({
        contractId: instance.contract.id,
        key: instance.roll.key,
      });
      var key = JSON.stringify([
        instance.key,
        contractCutinKey(instance),
        instance.roll.raw,
        instance.roll.template || '',
        instance.roll.kind || '',
        instance.roll.repeating || null,
        instance.roll.visibility || null,
        instance.roll.expressionRefs || [],
        candidate.requestedMode || '',
        mode ? contractUserModeLabels(mode) : [],
        mode ? contractOverrides(mode) : {},
        mode ? contractQueries(mode) : [],
        qualified.ok ? ['ok', qualified.content] : ['error', qualified.reason || '', qualified.error || ''],
        resultTemplate || null,
      ]);
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function preferDirectContractActions(instances, compatible) {
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(preferDirectContractActions(grouped[id], compatible));
      });
      return result;
    }
    var direct = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') < 0;
    });
    var variants = instances.filter(function (instance) {
      return String(instance && instance.roll && instance.roll.raw || '').indexOf('?{') > -1;
    });
    var addressable = variants.length && variants.every(function (instance) {
      return contractModeCandidates(instance, compatible).some(function (candidate) {
        return candidate.partialValues.length > 0;
      });
    });
    return direct.length && addressable ? direct : instances;
  }

  function preferLeastOverrideModes(candidates) {
    if (candidates.length < 2) return candidates;
    var minimum = dictionary();
    candidates.forEach(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      var count = Object.keys(contractOverrides(candidate.mode)).length;
      if (!own(minimum, key) || count < minimum[key]) minimum[key] = count;
    });
    return candidates.filter(function (candidate) {
      var key = candidate.instance.contract.id + '|' + candidate.instance.key;
      return Object.keys(contractOverrides(candidate.mode)).length === minimum[key];
    });
  }

  function contractModeContext(mode) {
    var found = dictionary();
    var labels = Array.isArray(mode && mode.labelPath)
      ? mode.labelPath
      : [mode && (mode.labelPath || mode.label)];
    labels.forEach(function (label) {
      String(label).split(/\s*(?:\|\||::|[|｜/>])\s*/).forEach(function (part) {
        var key = normalize(part);
        if (key) found[key] = true;
      });
    });
    return found;
  }

  function preferCurrentModeContext(characterId, candidates) {
    if (candidates.length < 2 || candidates.some(function (candidate) { return !candidate.mode; })) return candidates;
    function contextKey(candidate) {
      var rowId = candidate.instance.row ? candidate.instance.row.id : '';
      return candidate.instance.contract.id + '|' + candidate.instance.roll.key + '|' + rowId + '|' +
        Object.keys(contractOverrides(candidate.mode)).sort().join(',');
    }
    var sharedKey = contextKey(candidates[0]);
    if (candidates.some(function (candidate) { return contextKey(candidate) !== sharedKey; })) return candidates;
    var best = 0;
    var overrideKey = Object.keys(contractOverrides(candidates[0].mode)).sort().join(',');
    var currentModes = currentContractModes(characterId, candidates[0].instance).filter(function (mode) {
      return Object.keys(contractOverrides(mode)).sort().join(',') === overrideKey;
    });
    if (!currentModes.length) return candidates;
    var current = currentModes.map(contractModeContext);
    var ranked = candidates.map(function (candidate) {
      var wanted = contractModeContext(candidate.mode);
      var score = 0;
      current.forEach(function (currentLabels) {
        var overlap = Object.keys(wanted).filter(function (key) { return currentLabels[key]; }).length;
        if (overlap > score) score = overlap;
      });
      if (score > best) best = score;
      return { candidate: candidate, score: score };
    });
    return best ? ranked.filter(function (entry) { return entry.score === best; })
      .map(function (entry) { return entry.candidate; }) : candidates;
  }

  function contractMultipleRollRequest(query) {
    var matched = trim(query).match(
      /^(.+?)\s*((?:보너스|페널티|패널티)\s*(?:1|2|한\s*개|두\s*개)|bonus\s*[12]|penalty\s*[12])$/i,
    );
    return matched ? { base: trim(matched[1]), mode: trim(matched[2]) } : null;
  }

  function contractInlineRollCount(instance) {
    var fields = dictionary();
    String(instance && instance.roll && instance.roll.raw || '').replace(
      /\{\{\s*(roll\d*)\s*=\s*\[\[/gi,
      function (match, field) {
        fields[String(field).toLowerCase()] = true;
        return match;
      },
    );
    return Object.keys(fields).length;
  }

  function contractMultipleRollCandidates(instances, query) {
    var requested = contractMultipleRollRequest(query);
    if (!requested) return [];
    var grouped = dictionary();
    instances.forEach(function (instance) {
      var id = instance.contract.id;
      if (!grouped[id]) grouped[id] = [];
      grouped[id].push(instance);
    });
    var contractIds = Object.keys(grouped);
    if (contractIds.length > 1) {
      var result = [];
      contractIds.forEach(function (id) {
        result = result.concat(contractMultipleRollCandidates(grouped[id], query));
      });
      return uniqueContractCandidates(result);
    }
    var matched = closestContractActions(instances, requested.base, true);
    if (!matched.length) return [];
    var wantedMode = contractLookupKeys(requested.mode, true);
    var modes = [];
    matched.forEach(function (instance) {
      modes = modes.concat(contractModeCandidates(instance, true).filter(function (candidate) {
        return contractKeysMatch(candidate.exactValues, wantedMode, false);
      }));
    });
    modes = preferLeastOverrideModes(uniqueContractCandidates(modes));
    if (modes.length) return modes;
    if (matched.length < 2) return [];
    var counts = matched.map(contractInlineRollCount);
    var maximum = Math.max.apply(Math, counts);
    var minimum = Math.min.apply(Math, counts);
    if (maximum < 2 || maximum === minimum) return [];
    return uniqueContractCandidates(matched.filter(function (instance) {
      return contractInlineRollCount(instance) === maximum;
    }).map(function (instance) { return { instance: instance, requestedMode: requested.mode }; }));
  }

  function resolveContractAction(character, query, secret, options) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: true, result: { ok: false, error: inspection.error } };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { handled: false, result: null };
    var instances = actionableContractRolls(character.id, inspection, true).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    function exactCandidates(compatible) {
      var wanted = contractLookupKeys(query, compatible);
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, compatible)); });
      var exactModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(candidate.exactValues, wanted, false);
      })));
      var exactActions = preferDirectContractActions(instances.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible), wanted, false);
      }), compatible);
      return preferCurrentModeContext(character.id,
        uniqueContractCandidates(exactModes.concat(exactActions.map(function (instance) { return { instance: instance }; }))));
    }
    var exact = exactCandidates(false);
    if (!exact.length) exact = exactCandidates(true);
    exact = collapseEquivalentContractCandidates(character.id, exact);
    if (!contractLookupKeys(query, true).length) return { handled: false, result: null };
    if (exact.length === 1)
      return { handled: true, result: executeContractInstance(character, exact[0].instance, exact[0].mode ? exact[0].mode.id : '', secret) };
    if (exact.length > 1) return { handled: true, result: contractConflict(exact, secret) };
    var multipleRoll = collapseEquivalentContractCandidates(
      character.id,
      contractMultipleRollCandidates(instances, query),
    );
    if (multipleRoll.length === 1)
      return { handled: true, result: executeContractInstance(character, multipleRoll[0].instance,
        multipleRoll[0].mode ? multipleRoll[0].mode.id : '', secret, undefined, multipleRoll[0].requestedMode) };
    if (multipleRoll.length > 1) return { handled: true, result: contractConflict(multipleRoll, secret) };
    if (options && options.exactOnly) return { handled: false, result: null, inspection: inspection };
    var wanted = contractLookupKeys(query, true);
    var partialActions = preferDirectContractActions(closestContractActions(instances, query), true);
    var partial;
    if (partialActions.length) {
      partial = uniqueContractCandidates(partialActions.map(function (instance) { return { instance: instance }; }));
    } else {
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, true)); });
      partial = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(candidate.partialValues, wanted, true);
      })));
    }
    partial = preferCurrentModeContext(character.id, partial);
    partial = collapseEquivalentContractCandidates(character.id, partial);
    if (partial.length === 1)
      return { handled: true, result: executeContractInstance(character, partial[0].instance, partial[0].mode ? partial[0].mode.id : '', secret) };
    if (partial.length > 1) return { handled: true, result: contractConflict(partial, secret) };
    return { handled: false, result: null, inspection: inspection };
  }

  function executeContractExpression(character, expressionText, secret) {
    var inspection = inspectContracts(character.id);
    if (inspection.status === 'ambiguous' && inspection.recognitionReason !== 'source-defaults-ambiguous')
      return { ok: false, error: inspection.error };
    if (inspection.status !== 'matched' && inspection.recognitionReason !== 'source-defaults-ambiguous') return null;
    var safe = safeUserRollExpression(character.id, expressionText);
    if (!safe) return { ok: false, error: '자유 주사위 식은 2d6+3처럼 완전한 식으로 적어 주세요.' };
    var instances = actionableContractRolls(character.id, inspection, false).filter(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    }).map(function (instance) {
      instance.characterId = character.id;
      return instance;
    });
    if (!instances.length) return { ok: false, error: '현재 시트에는 식을 바꿔 굴릴 수 있는 항목이 없습니다.' };
    instances = collapseEquivalentContractCandidates(character.id, instances.map(function (instance) {
      return { instance: instance };
    }), safe).map(function (candidate) { return candidate.instance; });
    if (instances.length > 1)
      return contractConflict(instances.map(function (instance) { return { instance: instance }; }), secret, expressionText);
    return executeContractInstance(character, instances[0], '', secret, safe);
  }

  function sortedUnique(values) {
    var seen = dictionary();
    return (values || []).map(trim).filter(function (value) {
      var key = normalize(value);
      if (!key || seen[key]) return false;
      seen[key] = true;
      return true;
    }).sort(function (left, right) { return left.localeCompare(right); });
  }

  var ROLL_STATUS_GROUPS = [
    { key: 'check', title: '기능 / 판정' },
    { key: 'combat', title: '무기' },
    { key: 'spell', title: '주문' },
    { key: 'madness', title: '광기' },
    { key: 'other', title: '기타 주사위' },
  ];

  function rollStatusContext(instance) {
    var roll = instance && instance.roll || {};
    var groups = [];
    var labels = contractStaticLabels(roll).concat(roll.aliases || []);
    var structure = [roll.template].concat(sourceTemplateFieldNames(roll.raw));
    var repeating = contractRepeating(roll);
    if (repeating && instance && instance.contract) {
      var index = contractRuntimeIndex(instance.contract);
      var fields = index.fieldSections[repeating.section] || dictionary();
      contractRollFields(instance.contract, roll, index.controls).forEach(function (name) {
        var field = fields[name];
        if (!field) return;
        groups.push(field.groupLabel);
        structure.push(field.label);
        structure = structure.concat(field.aliases || []);
      });
    }
    return {
      groups: sortedUnique(groups.map(contractDisplayLabel).filter(Boolean)),
      labels: sortedUnique(labels.map(contractDisplayLabel).filter(Boolean)),
      structure: sortedUnique(structure.map(trim).filter(Boolean)),
    };
  }

  function rollStatusMatches(labels, pattern) {
    return (labels || []).some(function (label) { return pattern.test(trim(label)); });
  }

  function rollStatusLabel(instance) {
    var roll = instance && instance.roll || {};
    var rollName = normalize(roll.name);
    var rollKey = normalize(roll.key);
    return [instance && instance.label].concat(instance && instance.aliases || []).map(contractDisplayLabel).filter(function (label) {
      var key = normalize(label);
      return key && key !== rollName && key !== rollKey;
    })[0] || '';
  }

  function rollHasOutcomeStructure(item) {
    var roll = item && item.roll || {};
    var resultTemplates = item && item.contract && item.contract.resultTemplates;
    var template = resultTemplates && resultTemplates[roll.template];
    if (!template || !Array.isArray(template.rules)) return false;
    var sourceFields = dictionary();
    function addFields(raw) {
      sourceTemplateFieldNames(raw).forEach(function (name) { sourceFields[name] = true; });
    }
    addFields(roll.raw);
    (roll.modes || []).forEach(function (mode) {
      var overrides = contractOverrides(mode);
      Object.keys(overrides).forEach(function (name) { addFields(overrides[name]); });
      contractQueries(mode).forEach(function (query) {
        addFields(query.raw);
        addFields(query.value);
      });
    });
    var matched = dictionary();
    template.rules.forEach(function (rule) {
      if (!rule || !rule.outcome) return;
      var refs = [rule.valueField];
      (rule.conditions || []).forEach(function (condition) { refs = refs.concat(condition.args || []); });
      refs.forEach(function (name) {
        name = trim(name).toLowerCase();
        if (sourceFields[name]) matched[name] = true;
      });
    });
    return Object.keys(matched).length > 1;
  }

  function rollStatusCategory(item) {
    var structure = (item.groupLabels || []).concat(item.structureLabels || []);
    if (rollStatusMatches(structure, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(structure, /(?:주문|마법|주술|시전|spell|magic|sorcer|ritual)/i)) return 'spell';
    if (rollStatusMatches(structure, /(?:무기|전투|공격|피해|방어구|장갑|탄약|weapon|combat|attack|damage|defen[cs]e|armo(?:u)?r|ammo)/i)) return 'combat';
    if (rollHasOutcomeStructure(item)) return 'check';
    var context = (item.contextLabels || []).concat([item.label]);
    if (rollStatusMatches(context, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(context, /(?:주문|마법|주술|spell|magic|ritual)/i)) return 'spell';
    if (rollStatusMatches(context, /(?:무기|weapon)/i)) return 'combat';
    return 'other';
  }

  function groupedRollItems(items) {
    var groups = dictionary();
    ROLL_STATUS_GROUPS.forEach(function (group) { groups[group.key] = []; });
    (items || []).forEach(function (item) { groups[rollStatusCategory(item)].push(item); });
    return ROLL_STATUS_GROUPS.map(function (group) {
      return { key: group.key, title: group.title, items: groups[group.key] };
    });
  }

  function rollGroupSections(items, renderItem) {
    return groupedRollItems(items).filter(function (group) { return group.items.length; }).map(function (group) {
      return section(group.title + ' ' + group.items.length + '개', group.items.map(renderItem).join(' '));
    }).join('');
  }

  function contractRollDisplayValue(characterId, instance) {
    var values = [];
    var seenRefs = dictionary();
    var seenValues = dictionary();
    var ignored = dictionary();
    contractControls(instance.contract, instance.roll).forEach(function (control) {
      var name = contractControlName(control);
      if (name) ignored[name] = true;
    });
    String(instance && instance.roll && instance.roll.raw || '').replace(
      /@\{([A-Za-z0-9_$-]+)(?:\|(max))?\}/g,
      function (match, name, valueType) {
        if (ignored[name]) return match;
        var fullName = contractRowAttr(instance.contract, instance.roll, instance.row, name);
        var refKey = fullName + '|' + (valueType || 'current');
        if (seenRefs[refKey]) return match;
        seenRefs[refKey] = true;
        var raw = getAttr(characterId, fullName, valueType || 'current');
        if (raw === undefined) return match;
        var resolved = resolvedResourceValue(characterId, raw);
        if (resolved.number === null || seenValues[resolved.text]) return match;
        seenValues[resolved.text] = true;
        values.push(resolved.text);
        return match;
      },
    );
    return values.length === 1 ? values[0] : '';
  }

  function contractSelectionCommand(characterId, instance, count, secret) {
    return count > 1
      ? '!시트 굴림목록|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.label) + '|' + (secret ? '1' : '0')
      : '!시트 굴림선택|' + encodeURIComponent(characterId) + '|' + encodeURIComponent(instance.contract.id) + '|' +
        encodeURIComponent(instance.roll.key) + '|' + encodeURIComponent(instance.row ? instance.row.id : '') + '||' +
        (secret ? '1' : '0') + '|';
  }

  function recognizedRollItems(data) {
    var result = [];
    if (data.contractMatch && data.contractMatch.status === 'matched') {
      var counts = dictionary();
      data.contractRolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      var seen = dictionary();
      data.contractRolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (!key || seen[key]) return;
        seen[key] = true;
        result.push({
          kind: 'contract',
          label: instance.label,
          aliases: instance.aliases || [],
          value: contractRollDisplayValue(data.characterId, instance),
          modes: sortedUnique((instance.modes || []).reduce(function (labels, mode) {
            return labels.concat(contractUserModeLabels(mode));
          }, [])),
          command: contractSelectionCommand(data.characterId, instance, counts[key], false),
        });
      });
    }
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeEntries(instance) {
    var result = [];
    (instance.modes || []).forEach(function (mode) {
      contractUserModeLabels(mode).map(contractDisplayLabel).filter(Boolean).forEach(function (label) {
        result.push({
          id: trim(mode.id), label: label,
          modifier: /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label)),
        });
      });
    });
    return result;
  }

  function statusRollItems(data, includeEveryInstance) {
    var result = [];
    var counts = dictionary();
    var seen = dictionary();
    if (!data.contractMatch || data.contractMatch.status !== 'matched') return result;
    data.contractRolls.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    data.contractRolls.forEach(function (instance) {
      var label = rollStatusLabel(instance);
      var key = normalize(label);
      if (!key) return;
      var modeEntries = statusModeEntries(instance);
      if (!includeEveryInstance && seen[key]) {
        seen[key].modeEntries = seen[key].modeEntries.concat(modeEntries);
        return;
      }
      var context = rollStatusContext(instance);
      var item = {
        label: label,
        value: contractRollDisplayValue(data.characterId, instance),
        command: contractSelectionCommand(data.characterId, instance, counts[normalize(instance.label)] || 1, false),
        modeEntries: modeEntries,
        groupLabels: context.groups,
        contextLabels: context.labels,
        structureLabels: context.structure,
        contract: instance.contract,
        roll: instance.roll,
      };
      if (!seen[key]) seen[key] = item;
      result.push(item);
    });
    (data.contractAllRolls || []).forEach(function (instance) {
      if (!instance.hidden) return;
      var item = seen[normalize(rollStatusLabel(instance))];
      if (item) item.modeEntries = item.modeEntries.concat(statusModeEntries(instance));
    });
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeLayout(rolls) {
    var uses = dictionary();
    (rolls || []).forEach(function (item) {
      (item.modeEntries || []).forEach(function (entry) {
        if (!entry.id) return;
        uses[entry.id] = uses[entry.id] || dictionary();
        uses[entry.id][item.roll.key] = true;
      });
    });
    var shared = dictionary();
    Object.keys(uses).forEach(function (id) {
      if (Object.keys(uses[id]).length > 1) shared[id] = true;
    });
    var diceTypes = [];
    var madnessModes = dictionary();
    var items = [];
    (rolls || []).forEach(function (item) {
      var localModes = [];
      (item.modeEntries || []).forEach(function (entry) {
        if (entry.modifier) diceTypes.push(entry.label);
        else if (!shared[entry.id]) localModes.push(entry.label);
      });
      localModes = sortedUnique(localModes);
      if (rollStatusCategory(item) === 'madness' && localModes.length) {
        localModes.forEach(function (label) {
          var key = normalize(label);
          if (madnessModes[key]) return;
          madnessModes[key] = true;
          items.push(merge(merge({}, item), {
            label: label, value: '', localModes: [], contextLabels: (item.contextLabels || []).concat(item.label),
          }));
        });
        return;
      }
      item.localModes = localModes;
      items.push(item);
    });
    return { items: items, diceTypes: sortedUnique(diceTypes) };
  }

  function itemDetailText(data, detail) {
    var value = detail && detail[1];
    if (value === undefined || value === '') return '';
    return escapeHtml(detail[0]) + ' ' + escapeHtml(resolvedResourceValue(data.characterId, value).text || '-');
  }

  function searchHtml(data, query) {
    var wanted = normalize(query);
    var items = recognizedRollItems(data).concat((data.resources || []).map(function (item) {
      return {
        kind: 'resource', label: item.label, aliases: item.aliases,
        value: fieldValueText(data.characterId, { name: item.name, kind: 'number', max: item.max }, item.value), command: '',
      };
    }));
    items = items.filter(function (item) {
      return [item.label].concat(item.aliases || []).some(function (value) {
        var key = normalize(value);
        return key && (key.indexOf(wanted) > -1 || wanted.indexOf(key) > -1);
      });
    }).sort(function (left, right) { return left.label.localeCompare(right.label); });
    if (!items.length)
      return '<b>' + escapeHtml(query) + '</b>과 이름이 비슷한 항목을 찾지 못했습니다.';
    var labels = { contract: '굴림', resource: '수치' };
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / ' + escapeHtml(query) + ' 검색</b></div><table style="width:100%;border-collapse:collapse">' +
      items.map(function (item) {
        var details = (item.details || []).map(function (detail) { return itemDetailText(data, detail); }).filter(Boolean);
        return '<tr><td style="padding:7px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b> ' +
          '<span style="color:#777;font-size:11px">' + escapeHtml(labels[item.kind] || '항목') + '</span>' +
          (item.value !== '' && item.value !== undefined ? '<br><span style="color:#333">현재 ' + escapeHtml(item.value) + '</span>' : '') +
          (details.length ? '<br><span style="color:#555;font-size:11px">' + details.join(' / ') + '</span>' : '') + '</td>' +
          '<td style="padding:7px;text-align:right;white-space:nowrap">' +
          (item.command ? button('굴리기', item.command, '#111') : '') + '</td></tr>';
      }).join('') + '</table></div>';
  }

  // ===== 관리 핸드아웃 =====
  function button(label, command, color) {
    return '<a href="' + escapeHtml(command) + '" style="display:inline-block;margin:2px 1px;padding:5px 8px;background:' +
      (color || '#53657d') + ';color:#fff;text-decoration:none;font-weight:bold;font-size:12px">' + escapeHtml(label) + '</a>';
  }

  function section(title, body) {
    return '<div style="margin-top:10px;border:1px solid #111;background:#fff;color:#111"><div style="padding:6px 9px;background:#111;color:#fff;font-weight:bold">' +
      escapeHtml(title) + '</div><div style="padding:8px">' + body + '</div></div>';
  }

  function recognizedTable(items, actions) {
    return '<table style="width:100%;border-collapse:collapse"><tr>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">항목</th>' +
      '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:left">현재값 / 방식</th>' +
      (actions ? '<th style="padding:6px;border-bottom:1px solid #bbb;text-align:right">실행</th>' : '') + '</tr>' +
      (items || []).map(function (item) {
        var detail = [];
        if (item.value !== '' && item.value !== undefined) detail.push('<b>' + escapeHtml(item.value) + '</b>');
        if (item.localModes && item.localModes.length) detail.push(item.localModes.map(escapeHtml).join(' / '));
        return '<tr><td style="padding:6px;border-bottom:1px solid #ddd"><b>' + escapeHtml(item.label) + '</b></td>' +
          '<td style="padding:6px;border-bottom:1px solid #ddd">' + detail.join('<br>') + '</td>' +
          (actions ? '<td style="padding:4px 6px;border-bottom:1px solid #ddd;text-align:right;white-space:nowrap">' +
            (item.command ? button('실행', item.command, '#111') : '') + '</td>' : '') + '</tr>';
      }).join('') + '</table>';
  }

  function recognizedTablesHtml(data, actions, includeEveryInstance) {
    var layout = statusModeLayout(statusRollItems(data, includeEveryInstance));
    var groups = dictionary();
    groupedRollItems(layout.items).forEach(function (group) { groups[group.key] = group; });
    var html = '';
    ['check', 'combat', 'spell', 'madness'].forEach(function (key) {
      var group = groups[key];
      if (group && group.items.length) html += section(group.title + ' ' + group.items.length + '개', recognizedTable(group.items, actions));
    });
    if (data.resources && data.resources.length) {
      var resources = data.resources.map(function (item) {
        return {
          label: item.label,
          value: fieldValueText(data.characterId, { name: item.name, kind: 'number', max: item.max }, item.value),
        };
      });
      html += section('수치 ' + resources.length + '개', recognizedTable(resources, false));
    }
    if (groups.other && groups.other.items.length)
      html += section(groups.other.title + ' ' + groups.other.items.length + '개', recognizedTable(groups.other.items, actions));
    if (layout.diceTypes.length)
      html += section('다이스 종류 ' + layout.diceTypes.length + '개', recognizedTable(layout.diceTypes.map(function (label) {
        return { label: label, value: '' };
      }), false));
    return html;
  }

 function cutinItems() {
    var found = dictionary();
    function add(item, kind, system, key, characterName) {
      if (!item || !trim(item.label)) return;
      system = system || 'sheet';
      key = key || resultKey(system, item.label);
      if (!found[key]) found[key] = {
        key: key, label: item.label, kind: kind, system: system,
        aliases: item.aliases || [], characterName: characterName || '',
        command: item.command || '', type: item.type || '',
      };
    }
    characterObjects().forEach(function (character) {
      if (inspectContracts(character.id).status !== 'matched') return;
      var data = scan(character.id);
      data.contractRolls.forEach(function (instance) {
        add(
          { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
          instance.roll.kind || 'contract',
          'sheet',
          contractCutinKey(instance),
          character.get('name'),
        );
      });
    });
    var items = Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    var counts = dictionary();
    var indexes = dictionary();
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      counts[labelKey] = (counts[labelKey] || 0) + 1;
    });
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      if (counts[labelKey] < 2) return;
      indexes[labelKey] = (indexes[labelKey] || 0) + 1;
      item.displayLabel = item.label + ' (' + (item.characterName || '항목') + ' ' + indexes[labelKey] + ')';
    });
    return items;
  }

  function managerHtml() {
    var data = initState();
    var characters = profileCharacters();
    if (!characters.some(function (character) { return character.id === data.managerCharacterId; }))
      data.managerCharacterId = characters.length ? characters[0].id : '';
    var characterButtons = characters.length
      ? characters.map(function (character) {
          return button(
            character.id === data.managerCharacterId ? '✓ ' + character.get('name') : character.get('name'),
            '!시트 현황보기|' + character.id,
            character.id === data.managerCharacterId ? '#111' : '#53657d',
          );
        }).join(' ')
      : '<span style="color:#777">' + SHEET_NOT_RECOGNIZED + '</span>';
    var trackingLabel = data.trackingMode === 'public' ? '전체 공개' : data.trackingMode === 'gm' ? 'GM만' : '끄기';
    var trackingControls = '<b>수치 변화 알림:</b> ' + trackingLabel + '<br>' +
      button('전체 공개', '!시트 변화알림|공개', data.trackingMode === 'public' ? '#111' : '#53657d') + ' ' +
      button('GM만', '!시트 변화알림|GM', data.trackingMode === 'gm' ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 변화알림|끄기', data.trackingMode === 'off' ? '#111' : '#53657d') +
      '<br><b>플레이어 권한이 없는 GM 캐릭터도 알림:</b> ' + (data.trackGmOnly ? '켜기' : '끄기') + '<br>' +
      button('켜기', '!시트 GM캐릭터알림|켜기', data.trackGmOnly ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 GM캐릭터알림|끄기', data.trackGmOnly ? '#53657d' : '#111');
    var body =
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:12px;background:#111;color:#fff"><b style="font-size:18px">🎲 시트 헬퍼 관리</b></div>' +
      section('설정', button('시트 다시 읽기', '!시트 새로고침', '#287a4b') + '<br><br>' + trackingControls) +
      section('캐릭터별 현황 보기', '<span style="color:#555;font-size:11px">API가 인식한 현재 캐릭터들 현황 모아보기</span><br>' + characterButtons);
    var viewed = data.managerCharacterId && scan(data.managerCharacterId);
    if (viewed && viewed.ok) {
      var hasContract = viewed.contractMatch.status === 'matched';
      var issues = (viewed.warnings || []).slice();
      if (hasContract) {
        var modesIncomplete = (viewed.contractMatch.contract.rolls || []).some(function (roll) {
          return roll && roll.modesIncomplete === true;
        });
        if (modesIncomplete)
          issues.push('일부 선택 방식은 안전하게 실행할 수 없어 생략했습니다. 해당 굴림은 시트에서 직접 실행해 주세요.');
        body += recognizedTablesHtml(viewed, false, true);
      } else body += section('인식 결과', SHEET_NOT_RECOGNIZED);
      if (issues.length) body += section('확인할 항목', issues.map(escapeHtml).join('<br>'));
    }
    return body + '</div>';
  }

  function managerHandout() {
    var data = initState();
    var handout = getObj('handout', data.managerId) || (findObjs({ _type: 'handout', name: sheet_helper_setting.manager_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', { name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false });
    if (!handout) return null;
    data.managerId = handout.id;
    var html = managerHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.managerHash !== hash) {
      handout.set({ name: sheet_helper_setting.manager_name, inplayerjournals: '', controlledby: '', archived: false, notes: html });
      data.managerHash = hash;
    }
    return handout;
  }

  function playerHelpHandout() {
    var data = initState();
    var handout = getObj('handout', data.playerHelpId) ||
      (findObjs({ _type: 'handout', name: sheet_helper_setting.player_help_name }) || [])[0];
    if (!handout)
      handout = createObj('handout', {
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
      });
    if (!handout) return null;
    data.playerHelpId = handout.id;
    var html = playerHelpHtml();
    var hash = String(html.length) + ':' + simpleHash(html);
    if (data.playerHelpHash !== hash) {
      handout.set({
        name: sheet_helper_setting.player_help_name,
        inplayerjournals: 'all',
        controlledby: '',
        archived: false,
        notes: html,
      });
      data.playerHelpHash = hash;
    }
    return handout;
  }

  function simpleHash(value) {
    var hash = 2166136261;
    for (var i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return (hash >>> 0).toString(16);
  }

  function scheduleManager() {
    if (refreshTimer) clearTimeout(refreshTimer);
    refreshTimer = setTimeout(function () {
      refreshTimer = null;
      try {
        managerHandout();
        playerHelpHandout();
        var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
        if (cutin && typeof cutin.refreshSheetControls === 'function')
          cutin.refreshSheetControls();
      } catch (err) {
        whisperGm('시트 헬퍼 관리 갱신 오류: ' + escapeHtml(err.message || err));
      }
    }, sheet_helper_setting.refresh_delay);
  }

  function openManager() {
    var handout = managerHandout();
    return handout
      ? '<a href="http://journal.roll20.net/handout/' + encodeURIComponent(handout.id) + '" style="display:inline-block;padding:5px 8px;background:#111;color:#fff;text-decoration:none;font-weight:bold">시트 헬퍼 관리 열기</a>'
      : '관리 핸드아웃을 만들지 못했습니다.';
  }

  // ===== 안내 =====
  function playerName(msg) {
    var player = getObj('player', msg.playerid);
    return player ? trim(player.get('_displayname')) : trim(msg.who).replace(/\s*\(GM\)\s*$/, '') || 'gm';
  }

  function whisper(msg, text) {
    sendChat('시트 헬퍼', '/w "' + playerName(msg).replace(/"/g, '') + '" ' + safeWhisperText(text), null, { noarchive: true });
  }

  function whisperGm(text) {
    sendChat('시트 헬퍼', '/w gm ' + safeWhisperText(text), null, { noarchive: true });
  }

  function safeWhisperText(text) {
    return String(text == null ? '' : text).replace(/@\{/g, '&#64;{');
  }

  function switchSpeaker(msg, query) {
    if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
    var player = getObj('player', msg.playerid);
    if (!player) return whisper(msg, '화자를 바꿀 플레이어 정보를 찾지 못했습니다.');
    var rawDisplayName = trim(player.get('_displayname'));
    var displayName = rawDisplayName.replace(/\s*\(GM\)\s*$/i, '');
    if (
      normalize(query) === normalize(rawDisplayName) ||
      normalize(query) === normalize(displayName) ||
      /^(?:나|본인|해제|끄기|off)$/i.test(trim(query))
    ) {
      if (player.get('speakingas')) player.set({ speakingas: '' });
      return whisper(msg, '화자: <b>' + escapeHtml(player.get('_displayname')) + '</b>');
    }
    var found = resolveCharacterName(query, characterObjects());
    if (!found.ok) return whisper(msg, escapeHtml(found.error));
    var speakingAs = 'character|' + found.character.id;
    if (player.get('speakingas') !== speakingAs) player.set({ speakingas: speakingAs });
    return whisper(msg, '화자: <b>' + escapeHtml(found.character.get('name')) + '</b>');
  }

  function helpHtml() {
    return playerHelpHtml() +
      '<div style="margin-top:10px;padding-top:8px;border-top:1px solid #aaa"><b>GM 명령어</b><br>' +
      '<code>!!관리</code> 캐릭터별 인식 항목과 현재 수치 현황<br>' +
      '<code>!!점검</code> 현황에서 확인 중인 캐릭터의 인식 상태 점검<br>' +
      '<code>!!화자 이름</code> 채팅 화자 전환<br>' +
      '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀<br>' +
      '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위<br>' +
      '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함</div>';
  }

  function playerHelpHtml() {
    var character = profileCharacters()[0];
    var contractFree = !!character && scannedContractRolls(character.id, true).some(function (instance) {
      return !!contractExpressionRef(character.id, instance);
    });
    var rows = [
      ['!!굴릴항목이름', '해당 항목을 굴립니다. 예: <code>!!관찰력</code>'],
      ['!!비밀 굴릴항목이름', '결과를 GM에게만 보냅니다. 예: <code>!!비밀 관찰력</code>'],
      ['!!굴릴항목이름 보너스/패널티개수', '보너스 또는 패널티 주사위 개수를 붙여 굴립니다. 예: <code>!!관찰력 보너스1</code>, <code>!!관찰력 패널티2</code>'],
      ['!!검색 이름', '이름이 비슷한 항목과 현재 수치를 찾아 바로 굴립니다.'],
      ['!!상태', '내 캐릭터에서 인식된 굴림과 수치를 가나다순으로 봅니다.'],
      [':수치이름+3', '내 캐릭터 수치를 바꿉니다. 예: <code>:체력-1d3</code>, <code>:마력=10</code>'],
    ];
    if (contractFree)
      rows.push(['!!r 2d6+3', '현재 시트의 자유 주사위 디자인으로 식을 굴립니다.']);
    return (
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:10px;background:#111;color:#fff"><b>시트 헬퍼 사용법</b></div>' +
      '<table style="width:100%;border-collapse:collapse">' + rows.map(function (row) {
        return '<tr><td style="width:42%;padding:7px 8px;border-bottom:1px solid #ddd;background:#f5f5f5;vertical-align:top"><code style="font-weight:bold">' +
          escapeHtml(row[0]) + '</code></td><td style="padding:7px 8px;border-bottom:1px solid #ddd;vertical-align:top">' + row[1] + '</td></tr>';
      }).join('') + '</table><div style="padding:8px 10px">' +
      button('내 상태 보기', '!!상태', '#111') + ' ' +
      button('항목 검색', '!!검색 ?{찾을 이름}', '#111') +
      '<br><span style="color:#555;font-size:11px">이름 일부가 여러 항목과 맞으면 검정 선택 버튼으로 고를 수 있습니다.</span></div></div>'
    );
  }

  function statusHtml(data) {
    var rolls = statusRollItems(data);
    var modeLayout = statusModeLayout(rolls);
    var body = '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / 시트 현황</b></div>';
    body += modeLayout.items.length ? rollGroupSections(modeLayout.items, function (item) {
      return '<span style="display:inline-block;margin:0 8px 3px 0">' + escapeHtml(item.label) +
        (item.value ? ' <b>' + escapeHtml(item.value) + '</b>' : '') +
        (item.localModes && item.localModes.length ? ' <span style="color:#555">(' + item.localModes.map(escapeHtml).join(' / ') + ')</span>' : '') + '</span>';
    }) : section('굴릴 항목', '<span style="color:#777">없음</span>');
    if (modeLayout.diceTypes.length)
      body += section('다이스 종류 ' + modeLayout.diceTypes.length + '개', modeLayout.diceTypes.map(escapeHtml).join(', '));
    if (data.resources && data.resources.length)
      body += section('현재 수치 ' + data.resources.length + '개', data.resources.map(function (item) {
        return escapeHtml(item.label) + ' <b>' + escapeHtml(fieldValueText(data.characterId, { name: item.name, kind: 'number', max: item.max }, item.value)) + '</b>';
      }).join(', '));
    return body + '<div style="padding:8px 10px;color:#555;font-size:11px">항목을 좁혀 보려면 <code>!!검색 이름</code>을 입력하세요.</div></div>';
  }

  function inspectionHtml(data) {
    var recognition = data.contractMatch || {};
    var incomplete = data.contractMatch && data.contractMatch.status === 'matched'
      ? (data.contractMatch.contract.rolls || []).filter(function (roll) { return roll.modesIncomplete === true; }).length
      : 0;
    var issues = (data.warnings || []).slice();
    if (incomplete) issues.push('선택 방식을 전부 안전하게 읽지 못한 굴림 ' + incomplete + '개');
    if (recognition.contractCount && recognition.status !== 'matched')
      issues.push('설치된 시트 인식 정보가 방의 저장 항목과 일치하지 않습니다.');
    var matched = recognition.status === 'matched';
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / GM 인식 점검</b></div>' +
      section('인식 결과', matched
        ? '<b>인식 완료</b> / 현재 캐릭터의 굴림 ' + data.contractRolls.length + '개 / 수치 ' + (data.resources || []).length + '개'
        : SHEET_NOT_RECOGNIZED) +
      (matched ? recognizedTablesHtml(data, false, true) : '') +
      section('확인할 항목', issues.length ? issues.map(escapeHtml).join('<br>') : '<span style="color:#287a4b">확인할 문제가 없습니다.</span>') +
      '</div>';
  }

  function reportResult(msg, result) {
    if (result && result.ok === false)
      whisper(msg, result.reason === 'conflict' && result.choices ? bangBangChoiceHtml(result.choices) : escapeHtml(result.error));
    else if (result && result.queryOnly)
      whisper(msg, '<b>' + escapeHtml(result.weapon.label) + '</b> 탄약: ' + escapeHtml(result.value === '' ? '-' : result.value));
    return result;
  }

  // ===== 명령 처리 =====
  function withCharacter(msg, explicitId, callback) {
    var resolved = resolveCharacter(msg, explicitId);
    if (!resolved.ok) return reportResult(msg, resolved);
    return reportResult(msg, callback(resolved.character));
  }

  function uniqueResources(items) {
    var seen = dictionary();
    return (items || []).filter(function (item) {
      if (!item || seen[item.name]) return false;
      seen[item.name] = true;
      return true;
    });
  }

  function resolveResource(data, query) {
    var wanted = normalize(query);
    if (!wanted) return { ok: false, error: '바꿀 수치 이름을 적어 주세요.' };
    var exact = uniqueResources(data.resourceAliases[wanted] || []);
    if (exact.length === 1) return { ok: true, item: exact[0] };
    if (exact.length > 1)
      return { ok: false, error: '같은 이름의 수치가 여러 개입니다: ' + exact.map(function (item) { return item.label; }).join(', ') };
    var partial = uniqueResources((data.resources || []).filter(function (item) {
      return item.aliases.some(function (alias) { return normalize(alias).indexOf(wanted) > -1; });
    }));
    if (partial.length === 1) return { ok: true, item: partial[0] };
    if (partial.length > 1)
      return { ok: false, error: '이름이 비슷한 수치가 여러 개입니다: ' + partial.map(function (item) { return item.label; }).join(', ') };
    return { ok: false, error: '현재 시트에서 ' + trim(query) + ' 수치를 찾지 못했습니다.' };
  }

  function rollAmount(expression) {
    var source = trim(expression || '');
    var dice = source.match(/^(\d*)d(\d+)$/i);
    if (!dice) {
      var fixed = Number(source);
      return isFinite(fixed) ? { ok: true, value: fixed, detail: source } : { ok: false };
    }
    var count = Number(dice[1] || 1);
    var sides = Number(dice[2]);
    if (count < 1 || count > 100 || sides < 1 || sides > 100000) return { ok: false };
    var rolls = [];
    var total = 0;
    for (var i = 0; i < count; i += 1) {
      var rolled = randomInteger(sides);
      rolls.push(rolled);
      total += rolled;
    }
    return { ok: true, value: total, detail: source + ' [' + rolls.join(', ') + ']' };
  }

  function toggleValue(value) {
    var normalized = trim(value).toLowerCase();
    if (/^(?:1|on|true)$/.test(normalized)) return true;
    if (/^(?:0|off|false|)$/.test(normalized)) return false;
    return null;
  }

  function sanityValueText(characterId, item, current) {
    var data = scan(characterId);
    var sanity = detectedFieldRole(data, 'sanity', 'number');
    if (!sanity.item || sanity.item.name !== item.name) return '';
    var starting = detectedFieldRole(data, 'startingSanity', 'number');
    var hasStarting = starting.item && starting.item.name !== item.name && starting.item.value > 0;
    var hasStartingField = starting.matches.length ||
      (data.contractMatch.contract && data.contractMatch.contract.fields || []).some(function (field) {
        return matchesDetectedRole([field.label].concat(field.aliases || []), 'startingSanity');
      });
    var text = String(current);
    if (hasStarting)
      text += ' / 시작 ' + starting.item.value +
        ' (' + Math.round((current / starting.item.value) * 100) + '%)';
    else
      text += starting.ambiguous ? ' / 시작 확인 필요' : hasStartingField ? ' / 시작 미입력' : ' / 시작 항목 없음';
    if (sanity.item.max !== null) text += ' / 최대 ' + sanity.item.max;
    return text;
  }

  function fieldValueText(characterId, item, raw) {
    if (item.kind === 'toggle') {
      var enabled = trim(item.onValue) ? trim(raw) === trim(item.onValue) : toggleValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var current = numericFieldValue(characterId, raw);
    if (current === null) return trim(raw);
    var sanityText = sanityValueText(characterId, item, current);
    if (sanityText) return sanityText;
    return item.max !== null && item.max > 0
      ? current + ' / ' + item.max + ' (' + Math.round((current / item.max) * 100) + '%)'
      : String(current);
  }

  function resourceChangeContent(character, item, before, current, detail) {
    var beforeText = fieldValueText(character.id, item, before);
    var currentText = fieldValueText(character.id, item, current);
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    var delta = beforeNumber !== null && currentNumber !== null ? currentNumber - beforeNumber : 0;
    var deltaText = !delta || item.kind === 'toggle' ? ''
      : ' <span style="color:#777">(' + escapeHtml(Math.abs(delta)) + (delta > 0 ? ' 증가' : ' 감소') + ')</span>';
    var detailText = detail ? '<br><span style="color:#777">' + escapeHtml(detail) + '</span>' : '';
    return '<span style="color:#555"><b>' + escapeHtml(character.get('name')) + ' / ' + escapeHtml(item.label) +
      '</b> <span style="color:#aaa">' + escapeHtml(beforeText) + '</span> → <b>' + escapeHtml(currentText) +
      '</b>' + deltaText + detailText + '</span>';
  }

  function sendTrackedChange(character, item, before, current, detail) {
    var settings = initState();
    if (settings.trackingMode === 'off') return false;
    if (!settings.trackGmOnly && !hasPlayerController(character)) return false;
    var content = resourceChangeContent(character, item, before, current, detail);
    sendChat('시트 헬퍼', settings.trackingMode === 'gm' ? '/w gm ' + content : '/direct ' + content, null, { noarchive: true });
    return true;
  }

  function suppressKey(characterId, name) {
    return characterId + '|' + name;
  }

  function setResourceValue(characterId, item, value) {
    var text = String(value);
    var attribute = item.attribute;
    if (attribute && String(attribute.get('current') == null ? '' : attribute.get('current')) === text)
      return { attribute: attribute, changed: false };
    var key = suppressKey(characterId, item.name);
    var marker = { value: text };
    suppressedAttributeChanges[key] = marker;
    setTimeout(function () {
      if (suppressedAttributeChanges[key] === marker) delete suppressedAttributeChanges[key];
    }, 5000);
    if (!attribute) {
      var initial = getAttr(characterId, item.name);
      attribute = createObj('attribute', {
        characterid: characterId,
        name: item.name,
        current: String(initial == null ? '' : initial),
      });
    }
    if (!attribute) return { attribute: null, changed: false, error: '시트 수치를 저장하지 못했습니다.' };
    if (typeof attribute.setWithWorker === 'function') attribute.setWithWorker({ current: text });
    else attribute.set('current', text);
    return { attribute: attribute, changed: true };
  }

  function trackedRawValue(characterId, item) {
    return item && item.attribute
      ? item.attribute.get('current')
      : getAttr(characterId, item && item.name);
  }

  function trackedToggleEnabled(characterId, item) {
    if (!item) return false;
    var raw = trim(trackedRawValue(characterId, item));
    return trim(item.onValue) ? raw === trim(item.onValue) : toggleValue(raw) === true;
  }

  function activateTrackedToggle(character, item, detail, notifyChange) {
    if (!item || trackedToggleEnabled(character.id, item)) return false;
    var before = trackedRawValue(character.id, item);
    var next = trim(item.onValue) || '1';
    var saved = setResourceValue(character.id, item, next);
    if (!saved.changed) return false;
    item.attribute = saved.attribute;
    if (notifyChange !== false) sendTrackedChange(character, item, before, next, detail || '자동 활성화');
    return true;
  }

  function detectedRoleProblem(character, label, detected) {
    var suffix = detected && detected.ambiguous
      ? '같은 뜻의 항목이 여러 개입니다: ' + detected.matches.map(function (item) { return item.label; }).join(', ')
      : '해당 항목을 시트에서 찾지 못했습니다.';
    whisperGm('<b>' + escapeHtml(character.get('name')) + '</b> / ' + escapeHtml(label) + ' 자동 처리 생략: ' + escapeHtml(suffix));
    return label + ' 자동 처리 생략';
  }

  function successfulOutcome(result) {
    return result && ['critical', 'extreme', 'hard', 'success'].indexOf(result.outcome) > -1;
  }

  function finishAutomaticInsanity(payload, result, automation) {
    if (!successfulOutcome(result) || !automation || !automation.temporaryName) return;
    var character = getObj('character', payload.characterId);
    if (!character) return;
    var data = scan(character.id);
    if (automation.sourceHash && data.contractMatch && data.contractMatch.contract &&
      automation.sourceHash !== data.contractMatch.contract.sourceHash) return;
    var longItem = automation.longName && data.trackedFields[automation.longName];
    if (longItem && trackedToggleEnabled(character.id, longItem)) return;
    var temporary = data.trackedFields[automation.temporaryName];
    if (!temporary || temporary.kind !== 'toggle') return;
    if (activateTrackedToggle(character, temporary, '지능 판정 성공으로 자동 활성화')) {
      invalidate(character.id);
      scheduleManager();
    }
  }

  function applyDetectedRules(character, changedItem, before, current) {
    var data = scan(character.id);
    var details = [];
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    if (beforeNumber === null || currentNumber === null || currentNumber >= beforeNumber) return details;

    var health = detectedFieldRole(data, 'health', 'number');
    var changedHealth = health.item && health.item.name === changedItem.name;
    if (!changedHealth && health.ambiguous)
      changedHealth = health.matches.some(function (item) { return item.name === changedItem.name; });
    if (changedHealth) {
      if (!health.item) {
        details.push(detectedRoleProblem(character, '체력', health));
        return details;
      }
      var maximum = health.item.max;
      var canCheckMajorDamage = maximum !== null && maximum > 0;
      if (!canCheckMajorDamage)
        details.push(detectedRoleProblem(character, '최대 체력', { ambiguous: false, matches: [] }));
      var major = detectedFieldRole(data, 'majorWound', 'toggle');
      var majorActive = major.item && trackedToggleEnabled(character.id, major.item);
      if (canCheckMajorDamage && beforeNumber - currentNumber >= maximum / 2 && !majorActive) {
        if (!major.item) details.push(detectedRoleProblem(character, '중상', major));
        else if (activateTrackedToggle(character, major.item, '최대 체력의 절반 이상 피해', false)) {
          majorActive = true;
          details.push('중상 활성화');
        }
      }
      if (currentNumber <= 0 && majorActive) {
        var dying = detectedFieldRole(data, 'dying', 'toggle');
        if (!dying.item) details.push(detectedRoleProblem(character, '빈사', dying));
        else if (activateTrackedToggle(character, dying.item, '체력 0 및 중상 상태', false)) details.push('빈사 활성화');
      }
      if (details.length) {
        invalidate(character.id);
        scheduleManager();
      }
      return details;
    }

    var sanity = detectedFieldRole(data, 'sanity', 'number');
    var changedSanity = sanity.item && sanity.item.name === changedItem.name;
    if (!changedSanity && sanity.ambiguous)
      changedSanity = sanity.matches.some(function (item) { return item.name === changedItem.name; });
    if (!changedSanity) return details;
    if (!sanity.item) {
      if (beforeNumber - currentNumber >= 5) details.push(detectedRoleProblem(character, '이성', sanity));
      return details;
    }
    var longInsanity = detectedFieldRole(data, 'longInsanity', 'toggle');
    if (longInsanity.ambiguous) {
      details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      return details;
    }
    var longActive = longInsanity.item && trackedToggleEnabled(character.id, longInsanity.item);
    var startingSanity = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = startingSanity.item && startingSanity.item.value;
    if (!longActive && startingValue !== null && startingValue > 0 &&
      startingValue - currentNumber >= startingValue / 5) {
      if (!longInsanity.item) details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      else if (activateTrackedToggle(character, longInsanity.item, '시작 이성의 5분의 1 이상 손실', false)) {
        longActive = true;
        details.push('장기적 광기 활성화');
        invalidate(character.id);
        scheduleManager();
      }
    }
    if (beforeNumber - currentNumber < 5) return details;
    if (longActive) {
      details.push('장기적 광기 활성화 상태라 지능 판정 생략');
      return details;
    }
    var intelligence = detectedRollRole(data, 'intelligence');
    if (!intelligence.item) {
      details.push(detectedRoleProblem(character, '지능 판정', intelligence));
      return details;
    }
    var temporary = detectedFieldRole(data, 'temporaryInsanity', 'toggle');
    if (!temporary.item) {
      details.push(detectedRoleProblem(character, '일시적 광기', temporary));
    }
    var rolled = executeContractInstance(character, intelligence.item, '', false);
    if (!rolled || !rolled.ok) {
      details.push('지능 판정을 실행하지 못함');
      return details;
    }
    if (rolled.payload && rolled.payload.resultTracking !== false) {
      rolled.payload._automaticInsanity = {
        sourceHash: data.contractMatch.contract.sourceHash || '',
        longName: longInsanity.item ? longInsanity.item.name : '',
        temporaryName: temporary.item ? temporary.item.name : '',
      };
      details.push('지능 판정 자동 실행');
    } else details.push('지능 판정은 실행했지만 결과를 자동 인식할 수 없음');
    return details;
  }

  function applyResourceChange(character, query, operator, expression) {
    var data = scan(character.id);
    var resolved = resolveResource(data, query);
    if (!resolved.ok) return resolved;
    var amount = rollAmount(expression);
    if (!amount.ok) return { ok: false, error: '변경값은 +2, -1d3, =50 형식으로 입력해 주세요.' };
    var item = resolved.item;
    var current = numericFieldValue(character.id, item.attribute ? item.attribute.get('current') : item.value);
    if (current === null) return { ok: false, error: item.label + ' 값이 숫자가 아닙니다.' };
    var next = operator === '+' ? current + amount.value : operator === '-' ? current - amount.value : amount.value;
    next = Math.round(next * 1000000) / 1000000;
    var saved = setResourceValue(character.id, item, next);
    if (saved.error) return { ok: false, error: saved.error };
    if (!saved.changed) return { ok: true, value: next, unchanged: true };
    item.attribute = saved.attribute;
    var details = amount.detail !== String(amount.value) ? [amount.detail] : [];
    details = details.concat(applyDetectedRules(character, item, current, next));
    sendTrackedChange(character, item, current, next, details.join(' / '));
    invalidate(character.id);
    scheduleManager();
    return { ok: true, value: next };
  }

  function handleGeneralChange(msg) {
    var content = trim(msg.content);
    if (content.charAt(0) !== ':') return false;
    var match = content.match(/^:\s*(.+?)\s*([+\-=])\s*(\d*d\d+|\d+(?:\.\d+)?)\s*$/i);
    if (!match) {
      whisper(msg, '수치 변경은 <code>:체력+3</code>, <code>:이성-1d3</code>, <code>:마력=10</code>처럼 입력해 주세요.');
      return true;
    }
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok) {
      reportResult(msg, resolved);
      return true;
    }
    reportResult(msg, applyResourceChange(resolved.character, match[1], match[2], match[3]));
    return true;
  }

 function bangBangChoiceHtml(choices) {
    var labels = { check: '판정', weapon: '무기', spell: '주문', armor: '방어구' };
    return '<b>어느 항목을 실행할까요?</b><br>' + choices.map(function (choice) {
      if (choice.kind === 'contract') {
        var contractCommand = '!시트 굴림선택|' + encodeURIComponent(choice.characterId) + '|' +
          encodeURIComponent(choice.contractId) + '|' + encodeURIComponent(choice.rollKey) + '|' +
          encodeURIComponent(choice.rowId || '') + '|' + encodeURIComponent(choice.modeId || '') + '|' +
          (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.expression || '');
        return button(choice.label || choice.rollKey, contractCommand, '#111');
      }
      var command = '!시트 선택|' + encodeURIComponent(choice.characterId) + '|' + choice.kind + '|' +
        encodeURIComponent(choice.key) + '|' + (choice.secret ? '1' : '0') + '|' + encodeURIComponent(choice.mode || '');
      return button((choice.label || choice.key) + ' / ' + (labels[choice.kind] || choice.kind), command, '#111');
    }).join(' ');
  }

  function decodeCommandPart(value) {
    try {
      return { ok: true, value: decodeURIComponent(String(value == null ? '' : value)) };
    } catch (err) {
      return { ok: false, error: '선택 버튼 값이 올바르지 않습니다. 항목 이름을 다시 입력해 주세요.' };
    }
  }

  function handleLegacyAliasRoll(msg, body) {
    var resolved = resolveCharacter(msg, '');
    if (!resolved.ok || inspectContracts(resolved.character.id).status !== 'matched') return false;
    var contracted = resolveContractAction(resolved.character, body, false, { exactOnly: true });
    if (!contracted.handled) return false;
    reportResult(msg, contracted.result);
    return true;
  }

 function handleBangBang(msg, content) {
    var body = trim(content.substring(2));
    if (!body) {
      whisper(msg, helpHtml());
      return true;
    }
    if (safeRollExpression(body)) {
      var expressionCharacter = resolveCharacter(msg, '');
      if (expressionCharacter.ok) {
        var expressionContract = resolveContractAction(expressionCharacter.character, body, false, { exactOnly: true });
        if (expressionContract.handled) {
          reportResult(msg, expressionContract.result);
          return true;
        }
      }
      return false;
    }

    // 원본 시트에 관리 명령과 같은 이름의 굴림이 있으면 원본 굴림을 우선합니다.
    // 관리 기능은 명시형 !시트 명령으로 항상 실행할 수 있습니다.
    if (handleLegacyAliasRoll(msg, body)) return true;

    var search = body.match(/^검색(?:\s+(.+))?$/i);
    if (search) {
      if (!trim(search[1])) return reportResult(msg, { ok: false, error: '찾을 이름을 적어 주세요. 입력 예: !!검색 관찰' });
      handleNamespaced(msg, '!시트 검색|' + trim(search[1]));
      return true;
    }

    var tracking = body.match(/^(변화알림|추적)\s+(공개|public|show|GM|비공개|hide|끄기|해제|off)$/i);
    if (tracking) {
      handleNamespaced(msg, '!시트 변화알림|' + tracking[2]);
      return true;
    }
    var gmTracking = body.match(/^(GM캐릭터알림|GM전용추적)\s+(켜기|on|표시|show|끄기|해제|off|숨김|hide)$/i);
    if (gmTracking) {
      handleNamespaced(msg, '!시트 GM캐릭터알림|' + gmTracking[2]);
      return true;
    }

    var direct = body.match(/^(도움말|help|관리|새로고침|상태|목록|점검)$/i);
    if (direct) {
      handleNamespaced(msg, '!시트 ' + direct[1]);
      return true;
    }
    var managed = body.match(/^(화자|캐릭터|전환)\s+(.+)$/i);
    if (managed) {
      handleNamespaced(msg, '!시트 ' + managed[1] + '|' + trim(managed[2]));
      return true;
    }

    var secret = false;
    var secretMatch = body.match(/^비밀\s+(.+)$/);
    if (secretMatch) {
      secret = true;
      body = trim(secretMatch[1]);
    }

    var original = body.match(/^원본\s+(.+)$/);
    if (original) body = trim(original[1]);

    var freeExpression = body.match(/^r(?:\s+(.+))?$/i);
    if (freeExpression) {
      if (!trim(freeExpression[1]))
        return reportResult(msg, { ok: false, error: '자유 주사위 식을 적어 주세요. 입력 예: !!r 2d6+3' });
      return withCharacter(msg, '', function (character) {
        var contracted = executeContractExpression(character, freeExpression[1], secret);
        return contracted || { ok: false, error: SHEET_NOT_RECOGNIZED };
      });
    }

    return withCharacter(msg, '', function (character) {
      var contracted = resolveContractAction(character, body, secret);
      if (!contracted.handled) {
        var categorized = body.match(/^(?:판정|무기|주문|방어구)\s+(.+)$/);
        if (categorized) contracted = resolveContractAction(character, trim(categorized[1]), secret);
      }
      if (contracted.handled) return contracted.result;
      if (contracted.inspection && contracted.inspection.status === 'ambiguous')
        return { ok: false, error: contracted.inspection.error };
      return {
        ok: false,
        error: contracted.inspection && contracted.inspection.status === 'matched'
          ? '현재 시트에서 ' + trim(body) + ' 굴림을 찾지 못했습니다.'
          : SHEET_NOT_RECOGNIZED,
      };
    });
  }

  function handleNamespaced(msg, content) {
    var parts = content.substring(3).split('|').map(trim);
    var action = normalize(parts.shift() || '도움말');
    if (action === '추적') action = '변화알림';
    else if (action === 'gm전용추적') action = 'gm캐릭터알림';
    if (action === '도움말' || action === 'help') return whisper(msg, helpHtml());
    if (action === '검색')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, searchHtml(checked.data, parts[0]));
        return { ok: true };
      });
    if (action === '점검') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var inspected = resolveInspectionCharacter(msg);
      if (!inspected.ok) return reportResult(msg, inspected);
      return reportResult(msg, (function (character) {
        // 시트 구성이 바뀐 직후에도 현재 저장 항목을 다시 확인할 수 있도록
        // 진단 명령은 캐시만 비웁니다.
        invalidate();
        var recognition = inspectContracts(character.id);
        if (recognition.status === 'ambiguous')
          return { ok: false, error: recognition.error };
        if (recognition.status !== 'matched')
          return { ok: false, error: SHEET_NOT_RECOGNIZED };
        whisper(msg, inspectionHtml(scan(character.id, true)));
        return { ok: true };
      })(inspected.character));
    }
    if (action === '굴림목록' || action === '계약목록') {
      var listCharacter = decodeCommandPart(parts[0]);
      var listLabel = decodeCommandPart(parts[1]);
      if (!listCharacter.ok || !listLabel.ok)
        return reportResult(msg, !listCharacter.ok ? listCharacter : listLabel);
      return withCharacter(msg, listCharacter.value, function (character) {
        var inspection = inspectContracts(character.id);
        if (inspection.status !== 'matched')
          return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
        var matches = scannedContractRolls(character.id).filter(function (instance) {
          return normalize(instance.label) === normalize(listLabel.value);
        }).map(function (instance) {
          instance.characterId = character.id;
          return { instance: instance };
        });
        if (!matches.length) return { ok: false, error: '선택한 굴림이 바뀌었습니다. 관리 화면을 다시 열어 주세요.' };
        if (matches.length === 1) return executeContractInstance(character, matches[0].instance, '', parts[2] === '1');
        return contractConflict(matches, parts[2] === '1');
      });
    }
    if (action === '굴림선택' || action === '계약선택') {
      var contractCharacter = decodeCommandPart(parts[0]);
      var contractId = decodeCommandPart(parts[1]);
      var contractRollKey = decodeCommandPart(parts[2]);
      var contractRowId = decodeCommandPart(parts[3]);
      var contractModeId = decodeCommandPart(parts[4]);
      var contractExpression = decodeCommandPart(parts[6]);
      var invalidContractPart = [contractCharacter, contractId, contractRollKey, contractRowId, contractModeId, contractExpression]
        .filter(function (part) { return !part.ok; })[0];
      if (invalidContractPart) return reportResult(msg, invalidContractPart);
      if (!contractCharacter.value || !contractId.value || !contractRollKey.value)
        return reportResult(msg, { ok: false, error: '선택한 굴림 정보가 비어 있습니다. 항목을 다시 선택해 주세요.' });
      return withCharacter(msg, contractCharacter.value, function (character) {
        return executeContract(
          character.id,
          contractId.value,
          contractRollKey.value,
          contractRowId.value,
          contractModeId.value,
          parts[5] === '1',
          contractExpression.value,
        );
      });
    }
    if (action === '변화알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var trackingMode = normalize(parts[0]);
      if (/^(?:공개|public|show)$/.test(trackingMode)) initState().trackingMode = 'public';
      else if (/^(?:gm|비공개|hide)$/.test(trackingMode)) initState().trackingMode = 'gm';
      else if (/^(?:끄기|해제|off)$/.test(trackingMode)) initState().trackingMode = 'off';
      else return whisperGm('변화 알림은 공개, GM, 끄기 중 하나를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('수치 변화 알림: <b>' + (initState().trackingMode === 'public' ? '전체 공개' : initState().trackingMode === 'gm' ? 'GM만' : '끄기') + '</b>');
    }
    if (action === 'gm캐릭터알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var gmTracking = normalize(parts[0]);
      if (/^(?:켜기|on|표시|show)$/.test(gmTracking)) initState().trackGmOnly = true;
      else if (/^(?:끄기|해제|off|숨김|hide)$/.test(gmTracking)) initState().trackGmOnly = false;
      else return whisperGm('GM 전용 캐릭터 알림은 켜기 또는 끄기를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('플레이어 권한이 없는 GM 캐릭터 변화 알림: <b>' + (initState().trackGmOnly ? '켜기' : '끄기') + '</b>');
    }
    if (action === '관리') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      return whisperGm(openManager());
    }
    if (action === '새로고침') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      invalidate();
      initState().managerHash = '';
      managerHandout();
      return whisperGm('시트 항목을 다시 읽었습니다.');
    }
    if (action === '화자' || action === '캐릭터' || action === '전환')
      return switchSpeaker(msg, parts[0]);
    if (action === '현황보기' || action === '관리대상') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      if (!getObj('character', parts[0])) return whisperGm('캐릭터를 찾지 못했습니다.');
      initState().managerCharacterId = parts[0];
      initState().managerHash = '';
      managerHandout();
      return;
    }
    if (action === '상태' || action === '목록')
      return withCharacter(msg, '', function (character) {
        var checked = ensureSheet(character);
        if (!checked.ok) return checked;
        whisper(msg, statusHtml(checked.data));
        return { ok: true };
      });
    if (action === '판정' || action === '비밀판정')
      return withCharacter(msg, '', function (character) {
        return rollCheck(character.id, parts[0], { secret: action === '비밀판정', mode: parts[1] });
      });
    if (action === '무기' || action === '비밀무기')
      return withCharacter(msg, '', function (character) { return rollWeapon(character.id, parts[0], action === '비밀무기'); });
    if (action === '주문' || action === '비밀주문')
      return withCharacter(msg, '', function (character) { return showSpell(character.id, parts[0], action === '비밀주문'); });
    if (action === '방어구' || action === '비밀방어구')
      return withCharacter(msg, '', function (character) { return rollArmor(character.id, parts[0], action === '비밀방어구'); });
    return whisper(msg, '알 수 없는 시트 명령입니다.<br>' + helpHtml());
  }

  function handleLegacy(msg, content) {
    if (content.indexOf('!!') === 0) return handleBangBang(msg, content);
    if (content === '!s' || /^!s\s+/.test(content)) {
      var secretTarget = trim(content.substring(2));
      if (/^[\d(]/.test(secretTarget)) return false;
      withCharacter(msg, '', function (character) { return rollCheck(character.id, secretTarget, { secret: true }); });
      return true;
    }
    var match = content.match(/^!(?:atk|무기)\s+(.+)$/i);
    if (match) {
      withCharacter(msg, '', function (character) { return rollWeapon(character.id, match[1], false); });
      return true;
    }
    if (/^!(?:status|skills|기능|weapons)$/.test(content)) {
      withCharacter(msg, '', function (character) {
        whisper(msg, statusHtml(scan(character.id)));
        return { ok: true };
      });
      return true;
    }
    return false;
  }

  function contractRelevant(name) {
    var wanted = trim(name);
    if (!wanted) return false;
    var catalog = recognitionCatalog(sheetContracts());
    return !!catalog.exact[wanted] || triePrefixes(catalog.prefixes, wanted).length > 0;
  }

  function trackAttributeChange(attribute, previous) {
    if (!attribute || !previous) return;
    var characterId = attribute.get('_characterid');
    var name = trim(attribute.get('name'));
    var current = String(attribute.get('current') == null ? '' : attribute.get('current'));
    var before = String(previous.current == null ? '' : previous.current);
    if (!characterId || before === current) return;
    var key = suppressKey(characterId, name);
    if (suppressedAttributeChanges[key]) {
      if (suppressedAttributeChanges[key].value === current) {
        delete suppressedAttributeChanges[key];
        return;
      }
      delete suppressedAttributeChanges[key];
    }
    if (!contractRelevant(name)) return;
    var data = scan(characterId);
    var item = data.trackedFields && data.trackedFields[name];
    if (!item) return;
    var character = getObj('character', characterId);
    if (!character) return;
    var details = applyDetectedRules(character, item, before, current);
    sendTrackedChange(character, item, before, current, details.join(' / '));
  }

  function onAttributeChanged(attribute, previous, membershipChanged) {
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    if (previous) trackAttributeChange(attribute, previous);
    membershipChanged = !!membershipChanged || !!(previous && own(previous, 'name') && trim(previous.name) !== name);
    if (!characterId || (!membershipChanged && !contractRelevant(name))) return;
    if (membershipChanged) invalidate();
    else invalidate(characterId);
    scheduleManager();
  }

  // ===== 외부 연결 =====
  api.version = VERSION;
  api.scan = scan;
  api.roll = rollCheck;
  api.rollWeapon = rollWeapon;
  api.showSpell = showSpell;
  api.rollArmor = rollArmor;
  api.rollFree = rollFree;
  api.cutinItems = cutinItems;
  api.outcomes = OUTCOMES;
  api.registerContract = registerContract;
  api.sheetContracts = sheetContracts;
  api.inspectContracts = function (characterId) {
    return inspectContracts(characterId);
  };
  api.contractRolls = function (characterId) {
    var objects = attrObjects(characterId);
    return contractRolls(characterId, inspectContracts(characterId), objects);
  };
  api.exactContractInstance = exactContractInstance;
  api.qualifyContractMacro = qualifyContractMacro;
  api.executeContract = executeContract;
  api.resolveContractAction = resolveContractAction;
  api.refresh = function () {
    invalidate();
    initState().managerHash = '';
    initState().playerHelpHash = '';
    var manager = managerHandout();
    playerHelpHandout();
    return manager;
  };

  function registerAdapter() {
    var adapter = {
      meta: { code: '10_sheet_helper.js', title: '시트 헬퍼' },
      aliases: { 시트: '', sheet: '' },
      status: function () {
        return { sheets: sheetContracts().length };
      },
      cutinItems: cutinItems,
      outcomes: function () { return OUTCOMES; },
      refresh: api.refresh,
      help: [
        '<code>!!도움말</code> PL용과 GM용 명령어 확인',
        '<code>!!굴릴항목이름</code> 현재 시트의 굴림 실행',
        '<code>!!비밀 굴릴항목이름</code> 현재 시트의 굴림을 GM에게 실행',
        '<code>!!검색 이름</code> 항목과 현재 수치 검색',
        '<code>!!상태</code> PL용 현재 시트의 항목과 수치 확인',
        '<code>:수치이름+3</code> 내 캐릭터 수치 변경',
        '<code>!!점검</code> GM용 시트 인식 점검',
        '<code>!!화자 이름</code> GM용 채팅 화자 전환',
        '<code>!!화자 본인</code> 캐릭터 화자를 해제하고 GM 오너 프로필로 복귀',
        '<code>!!변화알림 공개|GM|끄기</code> 수치 변화 알림 공개 범위 설정',
        '<code>!!GM캐릭터알림 켜기|끄기</code> 플레이어 권한이 없는 GM 캐릭터도 알림에 포함',
        '<code>!!관리</code> GM용 인식 항목 관리',
      ],
    };
    if (typeof KIBScene.register === 'function') KIBScene.register('sheet', adapter);
    else {
      KIBScene.adapters = KIBScene.adapters || {};
      KIBScene.adapters.sheet = adapter;
    }
  }

  on('ready', function () {
    if (!sheet_helper_setting.enabled) return;
    initState();
    registerAdapter();
    if (typeof KIBScene.refreshHandout === 'function') KIBScene.refreshHandout();
    var cutin = KIBScene.adapters && KIBScene.adapters.cutin;
    if (cutin && typeof cutin.refreshSheetControls === 'function')
      cutin.refreshSheetControls();
    scheduleManager();
  });

  on('chat:message', function (msg) {
    if (!sheet_helper_setting.enabled || !msg) return;
    try {
      if (msg.type !== 'api' && captureResult(msg)) return;
      var content = trim(msg.content);
      if (!content) return;
      if (msg.type === 'general' && handleGeneralChange(msg)) return;
      if (msg.type === 'api') {
        if (/^!시트(?:$|\s|\|)/.test(content)) return handleNamespaced(msg, content);
        if (sheet_helper_setting.legacy_commands) handleLegacy(msg, content);
      }
    } catch (err) {
      whisperGm('시트 헬퍼 오류: ' + escapeHtml(err && err.message ? err.message : err));
    }
  });

  on('add:character', function (character) {
    scheduleManager();
  });
  on('destroy:character', function (character) {
    invalidate();
    if (initState().managerCharacterId === character.id) initState().managerCharacterId = '';
    scheduleManager();
  });
  on('add:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('change:attribute', function (attribute, previous) {
    onAttributeChanged(attribute, previous || null);
  });
  on('destroy:attribute', function (attribute) {
    onAttributeChanged(attribute, null, true);
  });
  on('destroy:handout', function (handout) {
    if (initState().managerId === handout.id) {
      initState().managerId = '';
      initState().managerHash = '';
    }
    if (initState().playerHelpId === handout.id) {
      initState().playerHelpId = '';
      initState().playerHelpHash = '';
    }
  });
})(KIBSheetHelper);
