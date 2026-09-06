/*
 * Scene Suite 10 - Sheet Helper 0.6.58
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
  if (compressed.length !== 330540 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 5146669) throw new Error('Invalid embedded sheet data length.');
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
  function hasKoreanDisplay(value) {
    if (typeof value === 'string') return /[가-힣]/.test(value);
    if (Array.isArray(value)) return value.some(hasKoreanDisplay);
    if (!value || typeof value !== 'object') return false;
    return Object.keys(value).some(function (key) { return hasKoreanDisplay(value[key]); });
  }
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
      if (roll[15]) restored.listHidden = true;
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
      var restored = { name: sheet.attributes[field[0]], type: fieldTypes[field[1]] || 'text',
        label: field[2] || sheet.attributes[field[0]], aliases: field[4] ? fieldAliasSets[field[4] - 1] : [],
        section: field[5] ? sections[field[5] - 1] : null, default: field[6] || '', max: field[7] || '', onValue: field[8] || '', visibility: field[9] ? fieldVisibilitySets[field[9] - 1] : null, groupLabel: field[10] || '',
        numericCandidate: !!(flags & 1), trackCandidate: !!(flags & 2), readonly: !!(flags & 4),
        disabled: !!(flags & 8), hidden: !!(flags & 16) };
      if (field[11]) restored.defaultVariants = [restored.default].concat(field[11]);
      if (field[12]) restored.radioRange = field[12].slice();
      return restored;
    });
    delete sheet.f;
    var koreanDisplay = (sheet.rolls || []).some(function (roll) {
      return hasKoreanDisplay([roll.label, roll.aliases, roll.staticLabels, roll.modes]);
    }) || (sheet.fields || []).some(function (field) {
      return hasKoreanDisplay([field.label, field.aliases, field.groupLabel]);
    });
    Object.defineProperty(sheet, 'recognitionLocale', {
      value: koreanDisplay ? 'ko' : 'foreign', configurable: true,
    });
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

  var VERSION = '0.6.59';
  var cache = {};
  var attributeObjectCache = {};
  var refreshTimer = null;
  var pendingResults = {};
  var contractIndexCache = {};
  var contractMatchCache = {};
  var contractCatalogCache = null;
  var suppressedAttributeChanges = {};
  var pendingAttributeChanges = {};
  var pendingAttributeOrder = [];
  var attributeChangeTimer = null;

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
    if (typeof data.trackSkillChanges !== 'boolean') data.trackSkillChanges = true;
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
          rows[rowId] = { id: rowId, prefix: prefix, values: dictionary(), names: dictionary(), refs: dictionary() };
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

  function sheetContracts() {
    var found = dictionary();
    var result = [];
    if (!Array.isArray(KIBSheetContracts)) return result;
    for (var i = KIBSheetContracts.length - 1; i >= 0; i--) {
      var contract = KIBSheetContracts[i];
      if (!contract || contract.recognitionLocale === 'foreign' || !contract.id ||
          !contract.signature || !Array.isArray(contract.rolls) || found[contract.id]) continue;
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

  function roomCacheValid(cached) {
    if (typeof getSheetDefaultValue !== 'function') return true;
    return !(cached.p || []).some(function (probe) {
      var v = getSheetDefaultValue(probe.name);
      return normalizedDefault(v) !== probe.value || (v == null) !== !!probe.m;
    });
  }

  function sourceDefaultEvidence(characterId, records, savedNames) {
    var scores = records.map(function () { return 0; });
    var blankContradictions = records.map(function () { return 0; });
    var missingContradictions = records.map(function () { return 0; });
    var sourceContradictions = records.map(function () { return 0; });
    var active = records.slice();
    var used = dictionary(),probes = [];
    var reads = typeof getSheetDefaultValue == 'function'?getSheetDefaultValue:cachedAttrReader(characterId);
    var savedUnique = records.map(function () { return 0; });
    Object.keys(savedNames || {}).forEach(function (name) {
      var owners = records.filter(function (record) { return !!record.globalSet[name]; });
      if (owners.length === 1) savedUnique[owners[0].ordinal] += 1;
    });
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
    var separatingDefaultNames = [];
    defaultNames.forEach(function (name) {
      var firstExpected = '';
      var different = false;
      var hasNonEmpty = false;
      var values = records.map(function (record, index) {
        var expected = expectedDefault(record, name);
        if (!index) firstExpected = expected;
        else if (expected !== firstExpected) different = true;
        if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
        return expected;
      });
      defaultValues[name] = values;
      if ((!savedNames || !savedNames[name]) && hasNonEmpty && different)
        separatingDefaultNames.push(name);
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
      for (var fieldAt = 0; fieldAt < separatingDefaultNames.length; fieldAt += 1) {
        var name = separatingDefaultNames[fieldAt];
        if (used[name]) continue;
        var counts = dictionary();
        var hasNonEmpty = false;
        for (var activeAt = 0; activeAt < active.length; activeAt += 1) {
          var expected = defaultValues[name][active[activeAt].ordinal];
          counts[expected] = (counts[expected] || 0) + 1;
          if (expected.indexOf('value:') === 0 && expected.length > 6) hasNonEmpty = true;
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
    for (var attempt = 0; attempt < 48; attempt += 1) {
      var name = nextField();
      if (!name) break;
      used[name] = true;
      var rawActual = reads(name);
      var actual = normalizedDefault(rawActual);
      if (rawActual === undefined || rawActual === null) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) missingContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: '', m: 1, matches: [] });
      } else if (!actual) {
        records.forEach(function (record) {
          var expected = defaultValues[name][record.ordinal];
          if (expected.indexOf('value:') === 0 && expected.length > 6) blankContradictions[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: [] });
      } else {
        var actualDefault = 'value:' + actual;
        // 현재 원본에 있는 필드를 선언하지 않은 후보는 공통 기본값이 같아도 제외합니다.
        // getAttrByName 대체 경로에는 이전 시트의 저장값이 섞일 수 있습니다.
        if (typeof getSheetDefaultValue === 'function') records.forEach(function (record) {
          if (!record.globalSet[name]) sourceContradictions[record.ordinal] += 1;
          else if (own(record.defaults, name) && normalizedDefault(record.defaults[name]) !== actual &&
              /[&?]\{|\{\{/.test(record.defaults[name] + actual)) {
            // 수치 보정은 중립으로 두되, 서로 다른 원본 굴림/템플릿 조각은 구별합니다.
            var alternatives = [record.defaults[name]];
            (record.contract.fields || []).forEach(function (field) {
              if (!field.section && field.name === name) {
                alternatives = alternatives.concat(field.defaultVariants || []);
                if (field.type === 'checkbox') alternatives.push('0');
              }
            });
            alternatives = alternatives.concat(contractOptionValues((record.contract.controls || {})[name]));
            if (!alternatives.some(function (value) { return normalizedDefault(value) === actual; }))
              sourceContradictions[record.ordinal] += 1;
          }
        });
        var matched = records.filter(function (record) {
          return defaultValues[name][record.ordinal] === actualDefault;
        });
        matched.forEach(function (record) {
          scores[record.ordinal] += 1;
        });
        probes.push({ name: name, value: actual, matches: matched.map(function (record) { return record.contract.id; }) });
      }
      var strongest = Math.max.apply(Math, scores);
      var viable = records.filter(function (record) {
        return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
      });
      var band = viable.filter(function (record) {
        return strongest < 2 || scores[record.ordinal] >= strongest - 2;
      });
      active = band.length ? band : viable.length ? viable : records.slice();
      var leaders = active.filter(function (record) { return scores[record.ordinal] === strongest; });
      var nextScore = active.filter(function (record) { return scores[record.ordinal] < strongest; })
        .reduce(function (maximum, record) { return Math.max(maximum, scores[record.ordinal]); }, 0);
      if (leaders.length === 1 && strongest >= 2 && strongest - nextScore >= 2 &&
          sourceContradictions[leaders[0].ordinal] === 0 &&
          savedUnique[leaders[0].ordinal] >= 2)
        return { record: leaders[0], survivors: active, scores: scores, probes: probes, matched: true };
    }
    var candidates = records.filter(function (record) {
      return missingContradictions[record.ordinal] === 0 && sourceContradictions[record.ordinal] === 0;
    });
    // Only the saved-attribute fallback may lack fields that the sheet declares.
    // An authoritative missing sheet default must keep that candidate excluded.
    if (!candidates.length && typeof getSheetDefaultValue !== 'function') candidates = records.filter(function (record) {
      return sourceContradictions[record.ordinal] === 0;
    });
    if (!candidates.length) return { record: null, survivors: [],
      scores: scores, probes: probes, matched: false };
    var ranked = candidates.sort(function (left, right) {
      return scores[right.ordinal] - scores[left.ordinal] || left.ordinal - right.ordinal;
    });
    var bestScore = ranked.length ? scores[ranked[0].ordinal] : 0;
    var best = ranked.filter(function (record) { return scores[record.ordinal] === bestScore; });
    var runnerScore = ranked[best.length] ? scores[ranked[best.length].ordinal] : 0;
    if (best.length === 1 && bestScore >= 2 && (bestScore - runnerScore >= 2 || ranked.length === 1))
      return { record: best[0], survivors: ranked, scores: scores, probes: probes, matched: true };
    active = ranked.filter(function (record) {
      return scores[record.ordinal] >= Math.max(0, bestScore - 1);
    });
    return { record: null, survivors: active.length ? active : ranked,
      scores: scores, probes: probes, matched: false };
  }

  function roomSourceDefaultEvidence(characters, records, ownersByName) {
    var fallback = { record: null, survivors: records.slice(), scores: records.map(function () { return 0; }), probes: [], matched: false };
    var savedCounts = dictionary();
    (characters || []).forEach(function (character) { savedCounts[character.id] = 0; });
    Object.keys(ownersByName || {}).forEach(function (name) {
      Object.keys(ownersByName[name] || {}).forEach(function (characterId) {
        if (own(savedCounts, characterId)) savedCounts[characterId] += 1;
      });
    });
    var candidates = (characters || []).slice().sort(function (left, right) {
      return savedCounts[left.id] - savedCounts[right.id] ||
        trim(left.get('name')).localeCompare(trim(right.get('name')));
    });
    var character = candidates[0];
    if (!character) return fallback;
    var savedNames = dictionary();
    Object.keys(ownersByName || {}).forEach(function (name) {
      if (ownersByName[name] && ownersByName[name][character.id]) savedNames[name] = true;
    });
    var evidence = sourceDefaultEvidence(character.id, records, savedNames);
    evidence.characterId = character.id;
    return evidence;
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
      var globalAttributes = (Array.isArray(contract.globalAttributes) ? contract.globalAttributes : attributes)
        .map(trim).filter(Boolean);
      var globalSet = dictionary();
      globalAttributes.forEach(function (name) { globalSet[name] = true; });
      var record = {
        contract: contract,
        ordinal: ordinal,
        signature: signature,
        attributes: attributes,
        globalAttributes: globalAttributes,
        globalSet: globalSet,
        globalCount: Object.keys(globalSet).length,
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
        var section = runtime.prefixSections[prefix];
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
      if (roomCacheValid(contractMatchCache.__room__)) {
        if (characterId) contractMatchCache[characterId] = contractMatchCache.__room__;
        return contractMatchCache.__room__;
      }
      invalidate();
    }
    var defaultEvidence = { probes: [], scores: [], matched: false };
    function remember(result) {
      result.attributeCount = persistentTotal;
      result.contractCount = contracts.length;
      result.p = typeof getSheetDefaultValue === 'function' ? defaultEvidence.probes : [];
      contractMatchCache.__room__ = result;
      if (characterId) contractMatchCache[characterId] = result;
      return result;
    }
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
        var sourceKey = 'repeating_' + match.section + '_' + field;
        matchedByContract[ordinal] = sourceKey;
        if (!match.record.signature.total) repeatingStat.sourceSeen[sourceKey] = true;
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
      if (completeFieldAdvantage || (total >= 5 && bestOnly >= 2 && bestOnly > runnerOnly))
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
    var sourceNarrowed = sourceSurvivorCount < catalog.records.length;
    var selection = sourceNarrowed
      ? scored.filter(function (item) { return sourceSurvivors[item.id]; })
      : scored;
    var selectedRecords = dictionary();
    var selectedGlobal = dictionary();
    selection.forEach(function (item) {
      var record = catalog.records.filter(function (record) {
        return record.contract.id === item.id;
      })[0];
      selectedRecords[item.id] = record;
      (record ? record.globalAttributes : []).forEach(function (name) { selectedGlobal[name] = true; });
    });
    var structureVotes = dictionary();
    var structureVoters = 0;
    Object.keys(liveOwners).forEach(function (owner) {
      var observed = dictionary();
      Object.keys(ownersByName).forEach(function (name) {
        if (!ownersByName[name][owner] || name.indexOf('repeating_') === 0 ||
            name.indexOf('_reporder_repeating_') === 0) return;
        if (selectedGlobal[name]) observed[name] = true;
      });
      var observedNames = Object.keys(observed);
      var observedCount = observedNames.length;
      if (observedCount < 5) return;
      var ranked = selection.map(function (item) {
        var record = selectedRecords[item.id];
        var declared = record ? record.globalSet : dictionary();
        var declaredCount = record ? record.globalCount : 0;
        var hits = observedNames.filter(function (name) { return declared[name]; }).length;
        var union = observedCount + declaredCount - hits;
        return {
          id: item.id,
          score: union ? hits / union : 0,
          observedCoverage: hits / observedCount,
          declaredCoverage: declaredCount ? hits / declaredCount : 0,
        };
      }).sort(function (left, right) { return right.score - left.score; });
      var bestStructure = ranked[0];
      var runnerStructure = ranked[1] || { score: 0 };
      if (!bestStructure || bestStructure.score < 0.9 || bestStructure.observedCoverage < 0.9 ||
          bestStructure.declaredCoverage < 0.9 || bestStructure.score - runnerStructure.score < 0.05) return;
      structureVotes[bestStructure.id] = (structureVotes[bestStructure.id] || 0) + 1;
      structureVoters += 1;
    });
    var structureWinner = selection.filter(function (item) {
      return (structureVotes[item.id] || 0) * 2 > structureVoters;
    });
    if (structureVoters && structureWinner.length === 1)
      return remember({ status: 'matched', contract: structureWinner[0].contract,
        match: structureWinner[0], matches: selection, recognitionReason: 'stored-structure' });
    var compatibilityWinner = selection.filter(function (item) {
      return item.compatibilityOwnerCount * 2 > recognizedOwnerCount;
    });
    if (compatibilityWinner.length === 1)
      return remember({ status: 'matched', contract: compatibilityWinner[0].contract,
        match: compatibilityWinner[0], matches: selection, recognitionReason: 'stored-attributes' });
    var eligible = selection.filter(function (item) { return item.eligible; });
    if (!eligible.length) {
      if (!selection.length) return remember({ status: 'none', contract: null, matches: [],
        recognitionReason: contracts.length ? 'conflicting-source-fields' : 'no-contracts' });
      var evidence = selection[0];
      var runnerUp = selection[1];
      if (!sourceNarrowed && evidence.uniqueEvidence >= 2 && (!runnerUp ||
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

  function usableContractInspection(inspection) {
    return !!inspection && (inspection.status === 'matched' ||
      (inspection.status === 'ambiguous' && inspection.recognitionReason === 'source-defaults-ambiguous'));
  }

  function sourceCandidateInspections(inspection) {
    if (!usableContractInspection(inspection)) return [];
    if (inspection.status === 'matched') return [inspection];
    return (inspection.matches || []).map(function (match) {
      return { status: 'matched', contract: match.contract, match: match, matches: inspection.matches };
    });
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
    if (condition.never === true) return false;
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

  function contractVisibilityNames(condition, found) {
    found = found || dictionary();
    if (!condition || typeof condition !== 'object') return found;
    if (Array.isArray(condition)) {
      condition.forEach(function (item) { contractVisibilityNames(item, found); });
      return found;
    }
    if (condition.name) found[trim(condition.name)] = true;
    ['all', 'any', 'not'].forEach(function (key) { contractVisibilityNames(condition[key], found); });
    return found;
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
    var value = reader
      ? reader(fullName, ref && ref.max ? 'max' : 'current')
      : getAttr(characterId, fullName, ref && ref.max ? 'max' : 'current');
    var index = contractRuntimeIndex(contract);
    var repeating = contractRepeating(roll);
    var field = repeating && index.fieldSections[repeating.section] && index.fieldSections[repeating.section][name] ||
      index.fieldGlobal[name];
    var resolved = trim(field && field.defaultVariants
      ? contractUnsavedFieldValue(field, value, field.default, ref && ref.max) : value);
    return /^(?:name|subject|title|label|skill|skill_name|weapon_name|attribute)$/i.test(trim(ref && ref.field)) &&
      !humanContractLabel(resolved) ? trim(field && field.default) : resolved;
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
      prefixSections: dictionary(),
      sections: dictionary(),
      rollFields: dictionary(),
      rollControls: dictionary(),
      rollsByKey: dictionary(),
      labelRefFrequency: dictionary(),
      fieldGlobal: dictionary(),
      fieldSections: dictionary(),
      fieldPrefixes: trieNode(),
      presentationControls: dictionary(),
      presentationRollGates: dictionary(),
      rollVisibilityReach: dictionary(),
    };
    var visibilityReach = dictionary();
    var visibilityConditions = [];
    var visibilityNames = [];
    var rollVisibilityPolarity = dictionary();
    var valueReferences = dictionary();
    function countVisibility(condition) {
      if (!condition) return;
      var index = visibilityConditions.indexOf(condition);
      if (index < 0) {
        index = visibilityConditions.length;
        visibilityConditions.push(condition);
        visibilityNames.push(Object.keys(contractVisibilityNames(condition)));
      }
      visibilityNames[index].forEach(function (name) {
        visibilityReach[name] = (visibilityReach[name] || 0) + 1;
      });
    }
    function countRollVisibility(condition, negated) {
      if (!condition || typeof condition !== 'object') return;
      if (Array.isArray(condition)) {
        condition.forEach(function (item) { countRollVisibility(item, negated); });
        return;
      }
      if (condition.not) countRollVisibility(condition.not, !negated);
      if (condition.name && condition.op) {
        var name = trim(condition.name);
        var op = trim(condition.op).toLowerCase();
        var negative = op.indexOf('not-') === 0 || op === 'neq';
        var polarity = negative !== !!negated ? 'negative' : 'positive';
        if (!rollVisibilityPolarity[name])
          rollVisibilityPolarity[name] = {
            positive: false,
            negative: false,
            positiveValues: dictionary(),
            positiveEqualityOnly: true,
          };
        rollVisibilityPolarity[name][polarity] = true;
        if (polarity === 'positive') {
          rollVisibilityPolarity[name].positiveEqualityOnly =
            rollVisibilityPolarity[name].positiveEqualityOnly && op === 'eq';
          if (own(condition, 'value'))
            rollVisibilityPolarity[name].positiveValues[String(condition.value)] = true;
        }
      }
      ['all', 'any'].forEach(function (key) { countRollVisibility(condition[key], negated); });
    }
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
          valueReferences[trim(name)] = true;
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
      countVisibility(field.visibility);
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
      var rollKey = String(roll.key);
      if (!own(index.rollsByKey, rollKey)) index.rollsByKey[rollKey] = roll;
      countVisibility(roll.visibility);
      countRollVisibility(roll.visibility, false);
      Object.keys(contractVisibilityNames(roll.visibility)).forEach(function (name) {
        index.rollVisibilityReach[name] = (index.rollVisibilityReach[name] || 0) + 1;
      });
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
          var name = contractRefName(ref);
          if (name) valueReferences[name] = true;
          addExact(name);
        });
      });
      (roll.modes || []).forEach(function (mode) {
        Object.keys(mode && mode.overrides || {}).forEach(function (name) { valueReferences[name] = true; });
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
    (Array.isArray(contract.fields) ? contract.fields : []).forEach(function (field) {
      if (!field || field.section || !/^(?:checkbox|radio)$/i.test(trim(field.type))) return;
      if ((visibilityReach[field.name] || 0) > 1 && !valueReferences[field.name])
        index.presentationControls[field.name] = true;
    });
    Object.keys(index.presentationControls).forEach(function (name) {
      var polarity = rollVisibilityPolarity[name];
      var field = index.fieldGlobal[name];
      var navigation = contract.controls && contract.controls[name] && contract.controls[name].navigation === true;
      var positiveValues = polarity ? Object.keys(polarity.positiveValues || {}) : [];
      var onValue = field && own(field, 'onValue') ? String(field.onValue) : '';
      var positiveCollapsedPanel = polarity && polarity.positive && !polarity.negative &&
        polarity.positiveEqualityOnly && positiveValues.length === 1 &&
        (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length &&
        field && trim(field.default) === '' && onValue !== '' && positiveValues[0] === onValue;
      if ((polarity && polarity.negative && !polarity.positive &&
          (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length) ||
          positiveCollapsedPanel || navigation)
        index.presentationRollGates[name] = true;
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
    var sectionCounts = dictionary();
    Object.keys(index.sections).forEach(function (section) {
      index.sections[section].sort(function (left, right) { return right.length - left.length; });
      index.prefixSections['repeating_' + section + '_'] = section;
      var folded = section.toLowerCase();
      sectionCounts[folded] = (sectionCounts[folded] || 0) + 1;
    });
    Object.keys(index.sections).forEach(function (section) {
      var folded = section.toLowerCase();
      var prefix = 'repeating_' + folded + '_';
      if (section === folded || sectionCounts[folded] !== 1 || own(index.prefixSections, prefix)) return;
      index.prefixSections[prefix] = section;
      index.prefixes.push(prefix);
      index.exact['_reporder_repeating_' + folded] = true;
      if (index.fieldSections[section]) trieAdd(index.fieldPrefixes, prefix, {
        prefix: prefix,
        section: section,
        fields: fieldSuffixTrie(Object.keys(index.fieldSections[section])),
      });
    });
    index.prefixes.sort(function (left, right) { return right.length - left.length; });
    contractIndexCache[key] = index;
    return index;
  }

  function humanContractLabel(value) {
    var label = trim(value);
    return !!label && label.length <= 100 &&
      !/[@%]\{/.test(label) &&
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
      var sourcePrefix = 'repeating_' + sectionName + '_';
      var prefixes = [sourcePrefix].concat(index.prefixes.filter(function (prefix) {
        return prefix !== sourcePrefix && index.prefixSections[prefix] === sectionName;
      }));
      var rows = [];
      prefixes.forEach(function (prefix) {
        var physicalSection = prefix.substring(10, prefix.length - 1);
        rows = rows.concat(collectRows(characterId, physicalSection, index.sections[sectionName], attributes, index.prefixes));
      });
      var rowPrefixes = dictionary();
      var conflicts = dictionary();
      rows.forEach(function (row) {
        if (own(rowPrefixes, row.id) && rowPrefixes[row.id] !== row.prefix) conflicts[row.id] = true;
        rowPrefixes[row.id] = row.prefix;
      });
      rowsBySection[sectionName] = rows.filter(function (row) { return !conflicts[row.id]; });
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
      if (roll.visibility && roll.visibility.never === true) return;
      var templateFields = messageTemplateFields({ content: String(roll.raw).replace(/([@%^])\{[^{}]*\}/g, '$1') });
      var repeating = contractRepeating(roll);
      var rows = repeating && repeating.section
        ? rowsBySection[repeating.section] || []
        : [null];
      rows.forEach(function (row) {
        var scopedControls = index.rollControls[roll.key] || dictionary();
        function readVisibility(name, atom) {
          if (index.presentationRollGates[name] && !atom.required) return { known: false };
          var scope = trim(atom && atom.scope).toLowerCase();
          if (scope === 'row' && !row) return { known: false };
          var fullName = scope === 'global' ? name : contractRowAttr(contract, roll, row, name);
          var control = scope === 'global' ? index.controls[name] : scopedControls[name] || index.controls[name];
          var hasValue = own(attributeValues, fullName);
          var liveValue = hasValue ? attributeValues[fullName].current : read(fullName, 'current');
          hasValue = hasValue || liveValue !== undefined && liveValue !== null && String(liveValue) !== '';
          if (hasValue) {
            var options = contractOptionValues(control);
            var validatesOptions = options.length > 1 ||
              /^(?:select|radio)$/i.test(trim(control && control.type));
            if (!validatesOptions || !options.length || options.indexOf(String(liveValue)) > -1)
              return { known: true, value: liveValue };
            return control && own(control, 'default')
              ? { known: true, value: control.default }
              : { known: false };
          }
          return control && own(control, 'default')
            ? { known: true, value: control.default }
            : { known: false };
        }
        var visibility = contractVisibilityResult(roll.visibility, readVisibility);
        if (contractVisibilityResult(roll.visibility, function (name, atom) {
          return atom.required ? readVisibility(name, atom) : { known: false };
        }) === false) return;
        if (visibility === false && !includeHidden) return;
        var rawVisible = trim(roll.label);
        var visible = contractDisplayLabel(rawVisible);
        if (visible && roll.name && normalize(visible) === normalize(roll.name)) visible = '';
        var staticLabels = contractStaticLabels(roll);
        if (!visible && rawVisible && !repeating) {
          var sourceGroups = dictionary();
          String(roll.raw || '').replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (match, name) {
            var field = index.fieldGlobal[name];
            var group = contractDisplayLabel(field && field.numericCandidate ? field.groupLabel : '');
            if (group) sourceGroups[normalize(group)] = group;
            return match;
          });
          var sourceGroupKeys = Object.keys(sourceGroups);
          if (sourceGroupKeys.length === 1) visible = sourceGroups[sourceGroupKeys[0]];
        }
        var dynamic = [];
        var expressionNames = (Array.isArray(roll.expressionRefs) ? roll.expressionRefs : []).map(contractRefName);
        var titleRefs = dictionary();
        var sourceTitleLabels = dictionary();
        var sectionFields = repeating && index.fieldSections[repeating.section] || dictionary();
        var titleValue = '';
        var expressionLabels = [];
        (Array.isArray(roll.labelRefs) ? roll.labelRefs : []).forEach(function (ref) {
          if (/\]\(\s*(?:~|!|%)/.test(templateFields[trim(ref && ref.field).toLowerCase()] || '')) return;
          var refName = contractRefName(ref);
          var sourceField = sectionFields[refName] || index.fieldGlobal[refName] || scopedControls[refName];
          var titleField = /^(?:name|subject|title|label|skill|skill_name|weapon_name|attribute)$/i.test(trim(ref && ref.field));
          var editableTitle = titleField && /(?:^|[_-])(?:name|title|label)(?:[_-]|$)/i.test(refName);
          if (!sourceField && refName !== 'character_name' && editableTitle && !roll.name && !staticLabels.length) titleRefs[refName] = true;
          if (expressionNames.indexOf(refName) < 0 && sourceField &&
            titleField &&
            /^(?:text|textarea)$/i.test(trim(sourceField.type)) && !sourceField.hidden &&
            !sourceField.readonly && !sourceField.disabled && !trim(sourceField.default) &&
            // ponytail: 이름칸은 굴림 4개까지만; 더 공유하면 상한 확대.
            (index.labelRefFrequency[refName] || 0) <= 4) {
            var fieldLabels = [sourceField.label].concat(sourceField.aliases || []).map(normalize).filter(Boolean);
            var rawKey = normalize(rawVisible).replace(/(?:name|check|roll)$/i, '');
            var refKey = normalize(refName).replace(/(?:name|check|roll)$/i, '');
            var machineNamed = (normalize(rawVisible) === normalize(roll.name) || normalize(rawVisible) === normalize(roll.key)) &&
              rawKey && refKey && (rawKey.indexOf(refKey) > -1 || refKey.indexOf(rawKey) > -1);
            if (fieldLabels.indexOf(normalize(rawVisible)) > -1 || machineNamed || editableTitle) {
              titleRefs[refName] = true;
              fieldLabels.forEach(function (label) { sourceTitleLabels[label] = true; });
            }
          }
          if (expressionNames.indexOf(refName) > -1) {
            var sourceLabel = contractDisplayLabel(sourceField && sourceField.label);
            if (sourceLabel && normalize(sourceLabel) !== normalize(refName)) expressionLabels.push(sourceLabel);
            return;
          }
          var value = contractLabelRef(characterId, contract, roll, row, ref, read);
          if (titleRefs[refName] && contractDisplayLabel(value) && !titleValue) titleValue = value;
          if (value) dynamic.push({
            value: value,
            frequency: index.labelRefFrequency[refName] || 0,
            title: !!titleRefs[refName],
            subject: titleField &&
              sourceField && /^(?:text|textarea)$/i.test(trim(sourceField.type)),
          });
        });
        if (Object.keys(titleRefs).length) {
          if (!titleValue) return;
          rawVisible = '';
          visible = '';
          staticLabels = staticLabels.filter(function (label) { return !sourceTitleLabels[normalize(label)]; });
        }
        dynamic.sort(function (left, right) {
          return Number(!!right.title) - Number(!!left.title) || left.frequency - right.frequency;
        });
        var usefulDynamic = dynamic.filter(function (entry) {
          return normalize(entry.value) !== characterName && entry.value !== characterId;
        });
        var rowLabels = usefulDynamic.map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var subjectLabels = usefulDynamic.filter(function (entry) { return entry.subject; })
          .map(function (entry) { return contractDisplayLabel(entry.value); }).filter(Boolean);
        var displayLabels = (row && rowLabels.length ? rowLabels :
          !roll.name && !staticLabels.length && subjectLabels.length ? subjectLabels : [visible])
          .concat(staticLabels.map(contractDisplayLabel).filter(Boolean))
          .concat(expressionLabels)
          .concat(row ? [visible] : rowLabels)
          .map(trim).filter(Boolean);
        if (!displayLabels.length && expressionNames.length === 1) displayLabels.push('자유 주사위');
        var labels = displayLabels
          .concat([rawVisible])
          .concat((roll.aliases || []).filter(function (label) { return !sourceTitleLabels[normalize(label)]; }))
          .concat(staticLabels)
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
          characterId: characterId,
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

  function actionableContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched') return scannedContractRolls(characterId, includeHidden);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    objects = objects || attrObjects(characterId);
    readLive = readLive || cachedAttrReader(characterId);
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
        prefix: match.prefix,
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

  function fieldChoiceLegend(value) {
    return /(?:^|\s)-?\d+(?:\.\d+)?\s*=\s*\S+/.test(trim(value));
  }

  function fieldRangeOnly(value) {
    return /^\(?\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)?$/i.test(trim(value));
  }

  function cleanFieldRange(value) {
    return trim(value).replace(/\s*\(\s*-?\d+(?:\.\d+)?\s*(?:to|~|\u2013|\u2014)\s*-?\d+(?:\.\d+)?\s*\)\s*$/i, '');
  }

  function fieldLabel(field, rowLabel) {
    var name = trim(field && field.name);
    var label = localFieldLabel(field) || name;
    var group = contractDisplayLabel(field && field.groupLabel);
    var role = normalize(label);
    var generic = /^(?:현재|최대|current|maximum|max|value|score|값|수치|점수)$/i;
    if (group && /^(?:현재|current|now)(?:값|수치|점수|value|score)?$/i.test(role)) {
      var sourceLabel = contractDisplayLabel(field && field.label);
      label = /^(?:현재|current|now).+|.+(?:현재|current|now)$/i.test(normalize(sourceLabel)) &&
        normalize(sourceLabel) !== normalize(name) && !generic.test(normalize(sourceLabel))
        ? sourceLabel : group;
    }
    else if (group && /^(?:최대|maximum|max|시작|초기|start|starting|initial|45|80%|threshold|문턱값|기준값)(?:값|수치|점수|value|score)?$/i.test(role))
      label = /[가-힣]/.test(label) ? label + ' ' + group : group + ' ' + label;
    if (normalize(label) === normalize(name) || generic.test(normalize(label)) || fieldChoiceLegend(label)) {
      var preferred = (field && field.aliases || []).map(contractDisplayLabel).filter(function (alias) {
        return alias && normalize(alias) !== normalize(name) && !generic.test(normalize(alias)) &&
          !fieldChoiceLegend(alias) && !fieldRangeOnly(alias);
      })[0];
      if (preferred) label = cleanFieldRange(preferred);
    }
    if (rowLabel && normalize(rowLabel) !== normalize(label)) return rowLabel + ' / ' + label;
    return rowLabel || label;
  }

  function numericRadioField(field) {
    var range = field && field.radioRange;
    return !!field && field.type === 'radio' && field.numericCandidate &&
      Array.isArray(range) && range.length === 2 &&
      range.every(function (value) { return typeof value === 'number' && isFinite(value) && Math.floor(value) === value; }) &&
      range[0] <= range[1];
  }

  function userFacingField(field) {
    if (numericRadioField(field)) return true;
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

  function fieldPairLabels(field, label, rowLabel) {
    var seen = dictionary();
    var group = contractDisplayLabel(field && field.groupLabel);
    var local = localFieldLabel(field);
    return [label, rowLabel, local, group, group && local ? group + ' ' + local : '', group && local ? local + ' ' + group : '']
      .map(contractDisplayLabel).filter(function (value) {
        var key = normalize(value);
        if (!key || seen[key]) return false;
        seen[key] = true;
        return true;
      });
  }

  function sourceFieldLabels(field, label, rowLabel) {
    var seen = dictionary();
    return fieldPairLabels(field, label, rowLabel).concat(field && field.aliases || [])
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
        /^(?:최대|maximum|max).+$/i.test(normalize(label)) ||
        /[_-](?:max|maximum)$/i.test(trim(label));
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

  function fieldPairNameKey(name) {
    return normalize(name)
      .replace(/^(?:현재|최대|current|maximum|max|now)/i, '')
      .replace(/(?:현재|최대|current|maximum|max|now)$/i, '');
  }

  function pairResourceMaximums(resources, references) {
    var maximumByKey = dictionary();
    var maximumByName = dictionary();
    (references || []).forEach(function (candidate, index) {
      if (!maximumFieldLabel(candidate.sourceLabels)) return;
      var nameKey = fieldPairNameKey(candidate.name);
      if (nameKey) {
        if (!maximumByName[nameKey]) maximumByName[nameKey] = [];
        maximumByName[nameKey].push({ candidate: candidate, index: index });
      }
      fieldPairKeys(candidate.pairLabels).forEach(function (key) {
        if (!maximumByKey[key]) maximumByKey[key] = [];
        maximumByKey[key].push({ candidate: candidate, index: index });
      });
    });
    (resources || []).forEach(function (item) {
      if (item.max !== null || maximumFieldLabel(item.sourceLabels)) return;
      var scores = dictionary();
      var candidates = [];
      function score(entry, amount) {
        if (entry.candidate.name === item.name) return;
        if (!scores[entry.index]) candidates.push(entry);
        scores[entry.index] = (scores[entry.index] || 0) + amount;
      }
      fieldPairKeys(item.pairLabels).forEach(function (key) {
        (maximumByKey[key] || []).forEach(function (entry) {
          score(entry, 1);
        });
      });
      (maximumByName[fieldPairNameKey(item.name)] || []).forEach(function (entry) {
        score(entry, 1000);
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
      if (matchCount === 1) {
        item.max = match.value;
        item._maxDefinition = match._definition || '';
      }
    });
  }

  function liveResourceFields(fields) {
    var result = dictionary();
    var maximums = dictionary();
    var maximumsByName = dictionary();
    (fields || []).filter(function (field) {
      return !field.section && !field.hidden &&
        /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()) &&
        maximumFieldLabel(sourceFieldLabels(field, fieldLabel(field, ''), ''));
    }).forEach(function (field) {
      var nameKey = fieldPairNameKey(field.name);
      if (nameKey) {
        if (!maximumsByName[nameKey]) maximumsByName[nameKey] = [];
        maximumsByName[nameKey].push(field);
      }
      fieldPairKeys(fieldPairLabels(field, localFieldLabel(field), '')).forEach(function (key) {
        if (!maximums[key]) maximums[key] = [];
        maximums[key].push(field);
      });
    });
    (fields || []).forEach(function (field) {
      if (field.section || field.hidden || field.readonly || field.disabled || !field.numericCandidate ||
        !userFacingField(field) || !(numericRadioField(field) || /^(?:text|number|range)$/.test(trim(field.type).toLowerCase()))) return;
      if (numericRadioField(field)) result[field.name] = true;
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), '');
      var labels = sourceFieldLabels(field, fieldLabel(field, ''), '').concat(field.name);
      if (trim(field.max) && ['health', 'sanity', 'magicPoints'].some(function (role) {
        return matchesDetectedRole(labels, role);
      })) result[field.name] = true;
      var keys = fieldPairKeys(pairLabels);
      var namedMaximums = maximumsByName[fieldPairNameKey(field.name)] || [];
      if (namedMaximums.length === 1 && namedMaximums[0] !== field) {
        result[field.name] = true;
        result[namedMaximums[0].name] = true;
      }
      keys.forEach(function (key) {
        var matches = (maximums[key] || []).filter(function (maximum) { return maximum !== field; });
        if (matches.length !== 1) return;
        result[field.name] = true;
        result[matches[0].name] = true;
      });
    });
    return result;
  }

  function contractUnsavedFieldValue(field, live, fallback, maximum) {
    var variants = !maximum && Array.isArray(field && field.defaultVariants) ? field.defaultVariants : [];
    if (variants.length) fallback = variants[0];
    if (live !== undefined && live !== null && trim(live) !== '') {
      var hiddenDefault = variants.slice(1).some(function (value) {
        return trim(value) === trim(live);
      });
      if (!hiddenDefault) return live;
    }
    return fallback;
  }

  function contractFieldItems(characterId, inspection, objects, rolls, readLive, includeDefinition) {
    var result = { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    if (!inspection || inspection.status !== 'matched') return result;
    var fields = Array.isArray(inspection.contract.fields) ? inspection.contract.fields : [];
    if (!fields.length) return result;
    var index = contractRuntimeIndex(inspection.contract);
    var liveFields = liveResourceFields(fields);
    var fieldDefaults = dictionary();
    fields.filter(function (field) { return !field.section; }).forEach(function (field) {
      if (own(field, 'default') && trim(field.default) !== '') fieldDefaults[field.name] = field.default;
      else if (trim(field.type).toLowerCase() === 'checkbox') fieldDefaults[field.name] = '0';
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
      var key = (instance.row.prefix || 'repeating_' + section + '_') + '|' + instance.row.id;
      if (!rowLabels[key] && trim(instance.label)) rowLabels[key] = trim(instance.label);
    });
    function fieldVisibility(match) {
      var condition = match.field && match.field.visibility;
      if (!condition) return true;
      return contractVisibilityResult(condition, function (name, atom) {
        var scope = trim(atom && atom.scope).toLowerCase();
        var fullName = name;
        if (scope !== 'global' && match.section && match.rowId)
          fullName = match.prefix + match.rowId + '_' + name;
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
      var prefix = match.prefix + match.rowId + '_';
      var values = dictionary();
      Object.keys(fields).forEach(function (name) {
        var field = fields[name];
        var fullName = prefix + name;
        var attribute = attributeByName[fullName];
        var current = attribute ? attribute.get('current') : undefined;
        var maximum = attribute ? attribute.get('max') : undefined;
        if (attribute) {
          if ((current === undefined || trim(current) === '') && own(field, 'default')) current = field.default;
          if ((maximum === undefined || trim(maximum) === '') && trim(field.max)) maximum = field.max;
        } else {
          current = contractUnsavedFieldValue(field, readLive(fullName, 'current'), field.default, false);
          var liveMaximum = readLive(fullName, 'max');
          maximum = liveMaximum !== undefined && liveMaximum !== null && trim(liveMaximum) !== ''
            ? liveMaximum : field.max;
        }
        if (current !== undefined && trim(current) !== '') values[fullName + '|current'] = current;
        if (maximum !== undefined && trim(maximum) !== '') values[fullName + '|max'] = maximum;
      });
      return { scopes: [prefix], fields: fields, values: values };
    }
    function sourceFieldValue(name, valueType) {
      var attribute = attributeByName[name];
      if (attribute) return attribute.get(valueType === 'max' ? 'max' : 'current');
      var field = index.fieldGlobal[name];
      var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
      var live = readLive(name, valueType);
      if (valueType !== 'max' && field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled)
        return contractUnsavedFieldValue(field, live, fallback, false);
      return live !== undefined && live !== null && trim(live) !== '' ? live : fallback;
    }
    var valueContext = { scopes: [], values: dictionary(), resolveAttribute: sourceFieldValue };
    function add(match, attribute, fallback) {
      var field = match.field;
      if (!userFacingField(field) && !liveFields[field.name]) return;
      var visible = fieldVisibility(match);
      if (visible === false) return;
      var fullName = match.name;
      var raw = attribute ? attribute.get('current') : fallback;
      var rowLabel = match.section ? rowLabels[match.prefix + '|' + match.rowId] || '' : '';
      var label = fieldLabel(field, rowLabel);
      var aliases = fieldAliases(field, label, rowLabel, fullName);
      var type = trim(field.type).toLowerCase();
      var sourceLabels = sourceFieldLabels(field, label, rowLabel);
      var pairLabels = fieldPairLabels(field, localFieldLabel(field), rowLabel);
      var rowContext = fieldRowContext(match) || valueContext;
      rowContext.resolveAttribute = sourceFieldValue;
      var localLabel = localFieldLabel(field);
      var statusResource = !!liveFields[fullName] &&
        !/^(?:최대|시작|초기|maximum|max|start|starting|initial|45|80%|threshold|문턱값|기준값)/i.test(normalize(localLabel));
      var definition = includeDefinition ? JSON.stringify(field) : '';
      var structure = includeDefinition ? JSON.stringify([
        type, trim(field.section), !!field.numericCandidate, !!field.trackCandidate,
        !!field.readonly, !!field.disabled, !!field.hidden, trim(field.default), trim(field.max), trim(field.onValue),
        field.defaultVariants || [], field.radioRange || [],
      ]) : '';
      var number = (numericRadioField(field) || /^(?:text|number|range)$/.test(type))
        ? numericFieldValue(characterId, raw, fieldDefaults, rowContext) : null;
      var tracked = !index.presentationControls[field.name] && !!field.trackCandidate &&
        (number !== null || type === 'checkbox');
      if (tracked) result.tracked[fullName] = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        kind: type === 'checkbox' ? 'toggle' : 'number',
        onValue: trim(field.onValue),
        value: raw,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
      };
      if (tracked && numericRadioField(field)) result.tracked[fullName].radioRange = field.radioRange.slice();
      if (number === null) return;
      var sourceMaximum = /@\{[^}]+\}/.test(trim(field.max)) ? field.max : '';
      var maxRaw = attribute && attribute.get('max');
      if (trim(maxRaw) === '' && sourceMaximum) {
        var liveMax = readLive(fullName, 'max');
        if (liveMax !== undefined && liveMax !== null && trim(liveMax) !== '') maxRaw = liveMax;
      }
      if (trim(maxRaw) === '') maxRaw = sourceMaximum;
      var item = {
        attribute: attribute || null,
        name: fullName,
        label: label,
        aliases: aliases,
        sourceLabels: sourceLabels,
        pairLabels: pairLabels,
        fieldLabel: localFieldLabel(field),
        value: number,
        max: numericFieldValue(characterId, maxRaw, fieldDefaults, rowContext),
        writable: !!field.numericCandidate,
        statusResource: statusResource,
        automationVisible: visible === true,
        _definition: definition,
        _structure: structure,
        _maxDefinition: sourceMaximum ? JSON.stringify(sourceMaximum) : '',
      };
      if (numericRadioField(field)) item.radioRange = field.radioRange.slice();
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
      else if (!field.hidden && (numericRadioField(field) || /^(?:text|number|range)$/.test(trim(field.type).toLowerCase())) && own(field, 'default')) {
        var fallback = field.default;
        if (liveFields[name]) {
          var live = readLive(name, 'current');
          fallback = contractUnsavedFieldValue(field, live, fallback, false);
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
    pairResourceMaximums(result.resources, result.references);
    result.resources.sort(function (left, right) {
      return left.label.localeCompare(right.label) || left.name.localeCompare(right.name);
    });
    return result;
  }

  function contractFieldItemFingerprint(item) {
    return JSON.stringify([
      item.name, item._structure || '', item.kind || '', trim(item.onValue),
      item.writable !== false, item.automationVisible === true,
    ]);
  }

  function commonContractFieldItems(characterId, inspection, objects, rolls, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractFieldItems(characterId, inspection, objects, rolls, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length)
      return { resources: [], tracked: dictionary(), aliases: dictionary(), byAttribute: dictionary(), references: [] };
    var results = candidates.map(function (candidate) {
      return contractFieldItems(
        characterId,
        candidate,
        objects,
        contractRolls(characterId, candidate, objects, false, readLive),
        readLive,
        true,
      );
    });
    function shared(property, dictionaryProperty) {
      var lists = results.map(function (result) {
        return dictionaryProperty
          ? Object.keys(result[property] || {}).map(function (name) { return result[property][name]; })
          : result[property] || [];
      });
      var indexes = lists.slice(1).map(function (items) {
        var found = dictionary();
        items.forEach(function (item) { found[contractFieldItemFingerprint(item)] = item; });
        return found;
      });
      return (lists[0] || []).filter(function (item) {
        var key = contractFieldItemFingerprint(item);
        return indexes.every(function (index) { return !!index[key]; });
      }).map(function (item) {
        var key = contractFieldItemFingerprint(item);
        var peers = [item].concat(indexes.map(function (index) { return index[key]; }));
        var merged = merge({}, item);
        ['aliases', 'sourceLabels'].forEach(function (property) {
          var seen = dictionary();
          merged[property] = [];
          peers.forEach(function (peer) {
            (peer[property] || []).forEach(function (value) {
              var normalized = normalize(value);
              if (!normalized || seen[normalized]) return;
              seen[normalized] = true;
              merged[property].push(value);
            });
          });
        });
        if (!own(item, 'max')) return merged;
        merged.max = peers.every(function (peer) {
          return peer.max === item.max;
        }) ? item.max : null;
        return merged;
      });
    }
    var value = {
      resources: shared('resources'),
      tracked: dictionary(),
      aliases: dictionary(),
      byAttribute: dictionary(),
      references: shared('references'),
    };
    pairResourceMaximums(value.resources, value.references);
    shared('tracked', true).forEach(function (item) { value.tracked[item.name] = item; });
    value.resources.forEach(function (item) {
      value.byAttribute[item.name] = item;
      item.aliases.forEach(function (alias) {
        var key = normalize(alias);
        if (!value.aliases[key]) value.aliases[key] = [];
        value.aliases[key].push(item);
      });
    });
    return value;
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

  function emptyResourceCacheHasLiveValue(characterId, cached) {
    var contract = cached && cached.contractMatch && cached.contractMatch.contract;
    if (!cached || !cached.matched || (cached.resources || []).length || !contract) return false;
    var fields = contractRuntimeIndex(contract).fieldGlobal;
    return attrObjects(characterId).some(function (attribute) {
      var field = fields[trim(attribute.get('name'))];
      return !!(field && field.numericCandidate &&
        /^[+-]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(trim(attribute.get('current'))));
    });
  }

  function scan(characterId, force) {
    var character = getObj('character', characterId);
    if (!character) return { ok: false, error: '캐릭터를 찾지 못했습니다.' };
    var cached = cache[characterId];
    if (!force && cached && cached.characterName === trim(character.get('name')) &&
        !emptyResourceCacheHasLiveValue(characterId, cached)) return cached;
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
    value.attributeByName = dictionary();
    objects.forEach(function (attribute) {
      var name = trim(attribute.get('name'));
      if (name) value.attributeByName[name] = attribute;
    });
    var readLive = cachedAttrReader(characterId);
    value.contractAllRolls = commonContractRolls(characterId, value.contractMatch, true, objects, readLive);
    value.contractRolls = value.contractAllRolls.filter(function (instance) { return !instance.hidden; });
    var fields = commonContractFieldItems(characterId, value.contractMatch, objects, value.contractRolls, readLive);
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

  function preferredContractRolls(data, forListing) {
    var instances = actionableContractRolls(data.characterId, data.contractMatch, false).filter(function (instance) {
      return !forListing || !instance.roll.listHidden;
    });
    var preferred = dictionary();
    collapseEquivalentContractCandidates(data.characterId, preferSingleInlineRollActions(
      uniqueContractCandidates(instances.map(function (instance) {
        return { instance: instance };
      })),
    )).forEach(function (candidate) {
      preferred[candidate.instance.contract.id + '|' + candidate.instance.key] = true;
    });
    return instances.filter(function (instance) {
      return preferred[instance.contract.id + '|' + instance.key];
    });
  }

  var DETECTED_ROLE_LABELS = {
    health: ['체력', 'hp', 'hitpoint', 'hitpoints'],
    sanity: ['이성', 'san', 'sanity'],
    magicPoints: ['마력', 'mp', 'magicpoint', 'magicpoints', 'mana'],
    startingSanity: ['시작이성', '초기이성', 'startingsanity', 'initialsanity'],
    majorWound: ['중상', 'majorwound'],
    dying: ['빈사', 'dying'],
    longInsanity: ['장기', '장기광기', '장기적광기', 'indefiniteinsanity', 'indefinsane'],
    temporaryInsanity: ['일시', '일시광기', '일시적광기', '단기광기', 'temporaryinsanity', 'tempinsane'],
    intelligence: ['지능', 'int', 'intelligence'],
    characteristic: [
      '근력', 'str', 'strength', '건강', 'con', 'constitution', '크기', 'siz', 'size',
      '민첩', '민첩성', 'dex', 'dexterity', '외모', 'app', 'appearance',
      '지능', 'int', 'intelligence', '정신', '정신력', 'pow', 'power', '교육', 'edu', 'education',
    ],
  };

  function detectedLabelKeys(labels) {
    var seen = dictionary();
    var result = [];
    (labels || []).forEach(function (label) {
      var key = normalize(contractDisplayLabel(label));
      var stripped = key
        .replace(/^(?:현재|current)/i, '')
        .replace(/(?:현재|current|값|수치|점수|value|score|체크|check|굴림|roll|판정|치)$/i, '');
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
    function collect(useAliases) {
      var seen = dictionary();
      return (items || []).filter(function (item) {
        var labels = item && item.fieldLabel && !useAliases
          ? [item.fieldLabel] : item && item.sourceLabels;
        if (!item || item.automationVisible !== true || !matchesDetectedRole(labels, role) || seen[item.name]) return false;
        seen[item.name] = true;
        return true;
      });
    }
    var matches = collect(false);
    if (!matches.length) matches = collect(true);
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
  }

  function linkedStartingSanityField(item, sanityName, labels) {
    var starting = detectedLabelKeys(labels).some(function (key) {
      return /^(?:시작|초기|starting|initial|start)(?:값|수치|점수|value|score)?$/i.test(key);
    });
    var candidateKey = fieldPairNameKey(item && item.name)
      .replace(/^(?:starting|initial|start|시작|초기)/i, '')
      .replace(/(?:starting|initial|start|시작|초기)$/i, '');
    return starting && candidateKey && candidateKey === fieldPairNameKey(sanityName);
  }

  function detectedFieldRole(data, role, kind) {
    var items = kind === 'toggle'
      ? Object.keys(data.trackedFields || {}).map(function (name) { return data.trackedFields[name]; })
        .filter(function (item) { return item.kind === 'toggle'; })
      : (role === 'startingSanity' ? (data.resources || []).concat(data.fieldReferences || []) : data.resources || []).filter(function (item) {
          return !maximumFieldLabel(item.sourceLabels) &&
            (role === 'startingSanity' || !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel)));
        });
    var detected = uniqueDetectedItems(items, role);
    if (role !== 'startingSanity' || detected.matches.length) return detected;
    var sanity = uniqueDetectedItems((data.resources || []).filter(function (item) {
      return !maximumFieldLabel(item.sourceLabels) &&
        !/^(?:시작|start|초기|initial)/i.test(normalize(item.fieldLabel));
    }), 'sanity');
    if (!sanity.item) return detected;
    var seen = dictionary();
    var matches = items.filter(function (item) {
      if (!item || item.automationVisible !== true || seen[item.name] ||
        !linkedStartingSanityField(item, sanity.item.name, item.sourceLabels)) return false;
      seen[item.name] = true;
      return true;
    });
    return { item: matches.length === 1 ? matches[0] : null, ambiguous: matches.length > 1, matches: matches };
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
    var rolls = preferredContractRolls(data);
    var matches = rolls.filter(function (instance) {
      var key = instance && instance.key;
      if (!key || seen[key] || !matchesDetectedRole(detectedRollLabels(instance), role)) return false;
      seen[key] = true;
      return true;
    });
    if (!matches.length) {
      var field = detectedFieldRole(data, role, 'resource');
      var namedFields = (data.resources || []).filter(function (item) {
        return item.automationVisible === true && matchesDetectedRole([item.name], role);
      });
      var name = field.item && field.item.name || (namedFields.length === 1 && namedFields[0].name);
      seen = dictionary();
      if (name) matches = rolls.filter(function (instance) {
        var key = instance && instance.key;
        var references = false;
        String(instance && instance.roll && instance.roll.raw || '').replace(
          /@\{([^{}|]+)(?:\|max)?\}/g,
          function (token, sourceName) {
            if (contractRowAttr(instance.contract, instance.roll, instance.row, trim(sourceName)) === name)
              references = true;
            return token;
          },
        );
        if (!key || seen[key] || !references) return false;
        seen[key] = true;
        return true;
      });
    }
    matches = preferSingleInlineRollActions(matches.map(function (instance) {
      return { instance: instance };
    })).map(function (candidate) { return candidate.instance; });
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
      .some(function(id){return id==='all'||getObj('player',id)&&!playerIsGM(id);});
  }

  function profileCharacters() {
    return characterObjects().filter(function (character) {
      return usableContractInspection(inspectContracts(character.id));
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
    if (!usableContractInspection(contractMatch))
      return {
        ok: false,
        error: contractMatch.error || SHEET_NOT_RECOGNIZED,
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

  function sourceResultTemplateForContract(contract, key) {
    if (!contract || !contract.resultTemplates) return null;
    var roll = contractRuntimeIndex(contract).rollsByKey[String(key)];
    if (!roll || !roll.template) return null;
    if (contract.resultTemplates[roll.template]) return contract.resultTemplates[roll.template];
    var wanted = normalize(roll.template);
    var names = Object.keys(contract.resultTemplates);
    for (var index = 0; index < names.length; index += 1) {
      if (normalize(names[index]) === wanted) return contract.resultTemplates[names[index]];
    }
    return null;
  }

  function sourceResultTemplate(payload) {
    if (!payload || !payload.contractId || !payload.key) return null;
    var contracts = sheetContracts();
    for (var i = 0; i < contracts.length; i += 1) {
      var contract = contracts[i];
      if (String(contract.id) === String(payload.contractId))
        return sourceResultTemplateForContract(contract, payload.key);
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
    payload.secret = !!payload.secret || !!(message &&
      (message.type === 'whisper' || message.type === 'gmrollresult'));
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
    var tokenMatch = content.match(/<!--\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*-->/i) ||
      content.match(/\{\{\s*kib_sheet_result\s*=\s*([A-Za-z0-9_-]+)\s*\}\}/i);
    if (tokenMatch) {
      if (own(pendingResults, tokenMatch[1])) {
        var pending = pendingResults[tokenMatch[1]];
        delete pendingResults[tokenMatch[1]];
        emitResult(pending.payload, message);
      }
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
      sendChat('character|' + character.id, content + ' <!--kib_sheet_result=' + token + '-->');
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
      var resolved = !rowLocal && rowContext && typeof rowContext.resolveAttribute === 'function'
        ? rowContext.resolveAttribute(candidates[i].name, valueType) : undefined;
      var value = rowLocal && rowContext.values && own(rowContext.values, valueKey)
        ? rowContext.values[valueKey]
        : rowLocal ? undefined : resolved !== undefined ? resolved
          : getAttr(characterId, candidates[i].name, valueType);
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
    if (/(?:\{\{|<!--)\s*kib_sheet_result\s*=/i.test(raw)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
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
        var stored = savedAttribute(fullName);
        var sourceField = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        var visibleDefault = !stored && sourceField && sourceField.numericCandidate &&
          !sourceField.hidden && !sourceField.readonly && !sourceField.disabled
          ? sourceValue(name, maximum) : null;
        var live = stored ? null : getAttr(characterId, fullName, maximum ? 'max' : 'current');
        var actual = stored ? stored.get(maximum ? 'max' : 'current')
          : visibleDefault !== null && !maximum
            ? contractUnsavedFieldValue(sourceField, live, visibleDefault, false)
            : live;
        if (!maximum && !humanContractLabel(actual) && (instance.roll.labelRefs || []).some(function (ref) {
          return contractRefName(ref) === name;
        })) actual = null;
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
    if (/(?:\{\{|<!--)\s*kib_sheet_result\s*=/i.test(content)) return { ok: false, error: '시트 헬퍼 예약 필드가 들어간 롤은 실행하지 않습니다.' };
    if (content.indexOf('?{') > -1)
      return { ok: false, reason: 'query', content: content, error: '이 굴림은 시트에서 고르는 값이 더 필요합니다.' };
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
      }
      if (qualified.reason !== 'query' || !qualified.content) return qualified;
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
    if (!qualified.ok) return { ok: false, reason: 'query', error: qualified.error,
      queryContent: content, queryLabel: label };
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

  function contractInstanceAliases(instance, compatible, primaryOnly) {
    var found = dictionary();
    var result = [];
    var labels = primaryOnly ? [instance.label,
      trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, '')] : instance.aliases || [];
    labels.forEach(function (value) {
      contractLookupKeys(value, compatible).forEach(function (key) {
        if (!found[key]) {
          found[key] = true;
          result.push(key);
        }
      });
    });
    if (compatible !== false && !primaryOnly && labels.some(function (value) {
      return /^(?:운|행운|luck)(?:roll|check|판정)?$/i.test(normalize(value));
    })) {
      ['운', '행운'].forEach(function (value) {
        var key = normalize(value);
        if (!found[key]) {
          found[key] = true;
          result.push(key);
        }
      });
    }
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

  function contractModeCandidates(instance, compatible, primaryOnly) {
    var actionAliases = contractInstanceAliases(instance, compatible, primaryOnly);
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
      result.push({ instance: instance, mode: mode, modeValues: modeAliases,
        exactValues: modeAliases.concat(combined), partialValues: combined });
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
    var best = 12;
    var found = [];
    instances.forEach(function (instance) {
      if (instance.hidden && !includeHidden) return;
      var rank = contractMatchRank(contractInstanceAliases(instance, true), wanted) * 4 +
        contractMatchRank(contractInstanceAliases(instance, true, true), wanted);
      if (rank < best) {
        best = rank;
        found = [instance];
      } else if (rank === best) found.push(instance);
    });
    return best < 12 ? found : [];
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

  function contractBehaviorContent(value, instance) {
    var content = String(value);
    var identityFields = dictionary();
    (instance.roll.labelRefs || []).concat(instance.roll.staticLabels || []).forEach(function (entry) {
      var field = trim(entry && entry.field);
      if (field) identityFields[field] = true;
    });
    Object.keys(identityFields).forEach(function (field) {
      var escaped = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      content = content.replace(new RegExp('(\\{\\{\\s*' + escaped + '\\s*=)[^}]*(\\}\\})', 'gi'), '$1*$2');
    });
    return content.replace(/\[\[([\s\S]*?)\]\]/g, function (token, expression) {
      return '[[' + expression.replace(
        /(\b\d*d(?:\d+|%|f))(?:c[fs](?:[<>=]?[-+]?\d+(?:\.\d+)?)?)+/gi,
        '$1',
      ) + ']]';
    }).replace(/\r\n?/g, '\n').trim();
  }

  function contractCandidateEquivalenceKey(characterId, candidate, expression) {
    var instance = candidate.instance;
    var mode = candidate.mode || null;
    function normalized(values) {
      return (values || []).map(normalize).filter(Boolean).sort();
    }
    function qualifiedSignature(selectedMode) {
      var qualified = qualifyContractMacro(characterId, instance, selectedMode, expression);
      return qualified.ok
        ? ['ok', contractBehaviorContent(qualified.content, instance)]
        : ['error', qualified.reason || '', qualified.error || ''];
    }
    var modeSignatures = mode ? [] : (instance.modes || []).map(function (availableMode) {
      return [normalized(contractUserModeLabels(availableMode)), qualifiedSignature(availableMode)];
    }).sort(function (left, right) {
      return JSON.stringify(left).localeCompare(JSON.stringify(right));
    });
    var resultTemplate = sourceResultTemplateForContract(instance.contract, instance.roll.key);
    return JSON.stringify([
        normalize(instance.label),
        instance.row ? instance.row.id : '',
        instance.roll.kind || 'contract',
        mode ? normalized(contractUserModeLabels(mode)) : modeSignatures,
        qualifiedSignature(mode),
        resultTemplate || null,
        !!instance.hidden,
      ]);
  }

  function collapseEquivalentContractCandidates(characterId, candidates, expression) {
    if (candidates.length < 2) return candidates;
    var copies = dictionary();
    candidates = candidates.filter(function (candidate) {
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var labels = contractStaticLabels(roll);
      var labelKey = normalize(trim(instance.label).replace(/\s*[（(][^()（）]*\d[^()（）]*[)）]\s*$/, ''));
      if (!labels.length || !roll.raw || !labels.some(function (label) {
        return normalize(label) === labelKey;
      })) return true;
      // 같은 행의 동일 출력/식 복제 버튼만 합치며 원본 계약과 키는 그대로 둡니다.
      var key = JSON.stringify([
        instance.contract.id, instance.row ? instance.row.id : '', roll.repeating || null,
        labelKey, labels, roll.raw, roll.refs || [], roll.expressionRefs || [], roll.modes || [],
        instance.hidden ? roll.visibility || null : null, !!instance.hidden, roll.kind || '', candidate.mode || null,
        roll.template || '',
      ]);
      if (copies[key]) return false;
      copies[key] = true;
      return true;
    });
    var firstContractId = candidates[0].instance.contract.id;
    if (candidates.every(function (candidate) {
      return candidate.instance.contract.id === firstContractId;
    })) return candidates;
    var found = dictionary();
    return candidates.filter(function (candidate) {
      var key = contractCandidateEquivalenceKey(characterId, candidate, expression);
      if (found[key]) return false;
      found[key] = true;
      return true;
    });
  }

  function commonContractRolls(characterId, inspection, includeHidden, objects, readLive) {
    if (inspection && inspection.status === 'matched')
      return contractRolls(characterId, inspection, objects, includeHidden, readLive);
    var candidates = sourceCandidateInspections(inspection);
    if (!candidates.length) return [];
    var groups = dictionary();
    actionableContractRolls(characterId, inspection, includeHidden, objects, readLive).forEach(function (instance) {
      var key = contractCandidateEquivalenceKey(characterId, { instance: instance });
      if (!groups[key]) groups[key] = instance;
    });
    return Object.keys(groups).map(function (key) { return groups[key]; });
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

  function contractRollStructure(instance) {
    var raw = String(instance && instance.roll && instance.roll.raw || '');
    var index = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var fields = repeating && index.fieldSections[repeating.section] || index.fieldGlobal;
    return raw.replace(/@\{([^{}|]+)\}/g, function (reference, name) {
      var field = fields[name] || index.fieldGlobal[name];
      if (!field) return reference;
      var value = instance.characterId
        ? getAttr(instance.characterId, contractRowAttr(instance.contract, instance.roll, instance.row, name)) : null;
      if (value === undefined || value === null || trim(value) === '') value = field.default;
      if (!/[&?]\{|\{\{/.test(String(value || ''))) return reference;
      var fragment = Object.assign({}, instance, { roll: Object.assign({}, instance.roll, { raw: reference }) });
      var qualified = qualifyContractMacro(instance.characterId, fragment);
      return qualified.ok || qualified.reason === 'query' ? qualified.content : reference;
    });
  }

  function contractInlineRollCount(instance) {
    var fields = dictionary();
    contractRollStructure(instance).replace(
      /\{\{\s*(roll\d*)\s*=\s*\[\[/gi,
      function (match, field) {
        fields[String(field).toLowerCase()] = true;
        return match;
      },
    );
    return Object.keys(fields).length;
  }

  function preferSingleInlineRollActions(candidates) {
    if (candidates.length < 2) return candidates;
    var groups = dictionary();
    candidates.forEach(function (candidate) {
      if (candidate.mode) return;
      var instance = candidate.instance;
      var roll = instance.roll || {};
      var structure = contractRollStructure(instance);
      var baseRaw = structure
        .replace(/&\{template:[^}]+\}/gi, '&{template:*}')
        .replace(/\{\{\s*roll(?:[2-9]\d*)\s*=\s*\[\[[\s\S]*?\]\]\s*\}\}/gi, '')
        .replace(/\s+/g, ' ').trim();
      var key = JSON.stringify([
        instance.contract.id,
        instance.row ? instance.row.id : '',
        normalize(instance.label),
        roll.visibility || null,
        roll.repeating || null,
        (roll.refs || []).filter(function (ref) {
          return structure.indexOf('@{' + contractRefName(ref) + (ref.max ? '|max' : '') + '}') > -1;
        }),
        roll.expressionRefs || [],
        roll.modes || [],
        baseRaw,
      ]);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var chosen = dictionary();
    Object.keys(groups).forEach(function (key) {
      var group = groups[key];
      var counts = group.map(function (candidate) { return contractInlineRollCount(candidate.instance); });
      var minimum = Math.min.apply(Math, counts);
      var maximum = Math.max.apply(Math, counts);
      var best = group.filter(function (candidate) {
        return contractInlineRollCount(candidate.instance) === minimum;
      });
      if (minimum < 1 || minimum === maximum || best.length !== 1) return;
      group.forEach(function (candidate) {
        chosen[candidate.instance.contract.id + '|' + candidate.instance.key] = best[0];
      });
    });
    var seen = dictionary();
    var result = [];
    candidates.forEach(function (candidate) {
      var replacement = chosen[candidate.instance.contract.id + '|' + candidate.instance.key] || candidate;
      var key = replacement.instance.contract.id + '|' + replacement.instance.key + '|' +
        String(replacement.mode && replacement.mode.id || '');
      if (seen[key]) return;
      seen[key] = true;
      result.push(replacement);
    });
    return result;
  }

  function preferVisibleContractCandidates(candidates) {
    var visible = candidates.filter(function (candidate) {
      var instance = candidate.instance || candidate;
      return !instance.hidden;
    });
    return visible.length ? visible : candidates;
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
      var primary = instances.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible, true), wanted, false) ||
          contractModeCandidates(instance, compatible, true).some(function (candidate) {
            return contractKeysMatch(candidate.partialValues, wanted, false);
          });
      });
      var matching = primary.length ? primary : instances;
      var modes = [];
      matching.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, compatible)); });
      var exactModes = preferLeastOverrideModes(uniqueContractCandidates(modes.filter(function (candidate) {
        return contractKeysMatch(primary.length ? candidate.partialValues : candidate.exactValues, wanted, false);
      })));
      var exactActions = preferDirectContractActions(matching.filter(function (instance) {
        return !instance.hidden && contractKeysMatch(contractInstanceAliases(instance, compatible), wanted, false);
      }), compatible);
      return preferCurrentModeContext(character.id,
        uniqueContractCandidates(exactModes.concat(exactActions.map(function (instance) { return { instance: instance }; }))));
    }
    var exact = exactCandidates(false);
    if (!exact.length) exact = exactCandidates(true);
    exact = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(exact));
    if (!contractLookupKeys(query, true).length) return { handled: false, result: null };
    if (exact.length === 1)
      return { handled: true, result: executeContractInstance(character, exact[0].instance, exact[0].mode ? exact[0].mode.id : '', secret) };
    var deferredModeConflict = exact.length > 1 && exact.every(function (candidate) { return !!candidate.mode; })
      ? exact : [];
    if (exact.length > 1 && !deferredModeConflict.length)
      return { handled: true, result: contractConflict(exact, secret) };
    var multipleRoll = collapseEquivalentContractCandidates(
      character.id,
      preferVisibleContractCandidates(contractMultipleRollCandidates(instances, query)),
    );
    if (multipleRoll.length === 1)
      return { handled: true, result: executeContractInstance(character, multipleRoll[0].instance,
        multipleRoll[0].mode ? multipleRoll[0].mode.id : '', secret, undefined, multipleRoll[0].requestedMode) };
    if (multipleRoll.length > 1) return { handled: true, result: contractConflict(multipleRoll, secret) };
    if (options && options.exactOnly) return { handled: false, result: null, inspection: inspection };
    var wanted = contractLookupKeys(query, true);
    var partialActions = preferDirectContractActions(preferVisibleContractCandidates(
      closestContractActions(instances, query),
    ), true);
    var partialActionRank = partialActions.length
      ? contractMatchRank(contractInstanceAliases(partialActions[0], true), wanted)
      : 3;
    var partial;
    if (partialActions.length) {
      partial = uniqueContractCandidates(partialActions.map(function (instance) { return { instance: instance }; }));
    } else {
      var modes = [];
      instances.forEach(function (instance) { modes = modes.concat(contractModeCandidates(instance, true)); });
      var directModes = modes.filter(function (candidate) {
        return contractKeysMatch(candidate.modeValues, wanted, true);
      });
      var matchingModes = directModes.length ? directModes : modes.filter(function (candidate) {
        return contractMatchRank(candidate.partialValues, wanted) < 2;
      });
      partial = preferLeastOverrideModes(uniqueContractCandidates(matchingModes));
    }
    partial = preferCurrentModeContext(character.id, partial);
    partial = collapseEquivalentContractCandidates(character.id, preferSingleInlineRollActions(partial));
    if (partial.length === 1 && (!deferredModeConflict.length || partialActionRank === 1))
      return { handled: true, result: executeContractInstance(character, partial[0].instance, partial[0].mode ? partial[0].mode.id : '', secret) };
    if (deferredModeConflict.length)
      return { handled: true, result: contractConflict(deferredModeConflict, secret) };
    if (partial.length > 1) return { handled: true, result: contractConflict(partial, secret) };
    var roleNames = Object.keys(DETECTED_ROLE_LABELS).filter(function (role) {
      return role !== 'characteristic' && (DETECTED_ROLE_LABELS[role] || []).indexOf(normalize(query)) > -1;
    });
    if (roleNames.length === 1) {
      var detected = detectedRollRole(scan(character.id), roleNames[0]);
      if (detected.item)
        return { handled: true, result: executeContractInstance(character, detected.item, '', secret) };
    }
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
    { key: 'characteristic', title: '특성치' },
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
    var sourceRaw = contractRollStructure(instance);
    var structure = [roll.template].concat(sourceTemplateFieldNames(sourceRaw));
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
      sourceRaw: sourceRaw,
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
    var sourceLabels = contractStaticLabels(roll).map(normalize);
    return [instance && instance.label].concat(instance && instance.aliases || []).map(contractDisplayLabel).filter(function (label) {
      var key = normalize(label);
      return key && (key !== rollName && key !== rollKey || sourceLabels.indexOf(key) > -1);
    })[0] || '';
  }

  function rollInstanceStatusCategory(instance) {
    var context = rollStatusContext(instance);
    return rollStatusCategory({
      label: rollStatusLabel(instance), groupLabels: context.groups, contextLabels: context.labels,
      structureLabels: context.structure, sourceRaw: context.sourceRaw, contract: instance.contract, roll: instance.roll,
    });
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
    addFields(item.sourceRaw || roll.raw);
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

  function rollHasPercentileThreshold(item) {
    var raw = String(item && (item.sourceRaw || item.roll && item.roll.raw) || '');
    var fields = sourceTemplateFieldNames(raw);
    var splitPercentile = /\b(?:\d+)?d10(?!\d)/i.test(raw) &&
      fields.indexOf('roll_half') > -1 && fields.indexOf('roll_fifth') > -1;
    if (!/\b(?:\d+)?d100/i.test(raw) && !splitPercentile) return false;
    return fields.some(function (name) {
      return /(?:^|[_-])(?:stat|threshold|target|success|skill|ability|characteristic|score)(?:$|[_-])/i.test(name);
    });
  }

  function rollStatusCategory(item) {
    var structure = (item.groupLabels || []).concat(item.structureLabels || []);
    if (rollStatusMatches(structure, /(?:광기|정신\s*이상|발작|insanit|madness|bout)/i)) return 'madness';
    if (rollStatusMatches(structure, /(?:주문|마법|주술|시전|spell|magic|sorcer|ritual)/i)) return 'spell';
    if (rollStatusMatches(structure, /(?:무기|전투|공격|피해|방어구|장갑|탄약|weapon|combat|attack|damage|defen[cs]e|armo(?:u)?r|ammo)/i)) return 'combat';
    if (/&\{tracker\}/i.test(String(item && item.roll && item.roll.raw || ''))) return 'other';
    if (rollStatusMatches(structure, /(?:^|[_-])(?:sanity|luck)(?:$|[_-])/i)) return 'check';
    var context = (item.contextLabels || []).concat([item.label]);
    if (!contractRepeating(item.roll) && (matchesDetectedRole(context, 'characteristic') ||
        rollStatusMatches(item.structureLabels, /(?:^|[_-])characteristic(?:$|[_-])/i))) return 'characteristic';
    if (rollHasOutcomeStructure(item) || rollHasPercentileThreshold(item)) return 'check';
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

  function statusResourceItems(data) {
    return (data && data.resources || []).filter(function (item) { return item.statusResource === true; });
  }

  function rollGroupSections(items, renderItem) {
    return groupedRollItems(items).filter(function (group) { return group.items.length; }).map(function (group) {
      return section(group.title + ' ' + group.items.length + '개', group.items.map(renderItem).join(' '));
    }).join('');
  }

  function contractRollDisplayValue(data, instance) {
    var characterId = data.characterId;
    var runtimeIndex = contractRuntimeIndex(instance.contract);
    var repeating = contractRepeating(instance.roll);
    var sourceFields = repeating && runtimeIndex.fieldSections[repeating.section] || runtimeIndex.fieldGlobal;
    var tr = /\{\{\s*(?:[^={}]*?(?:threshold|target)[^={}]*|stat|s(?:core|uccess|kill)|check|ability|characteristic)\s*=\s*\[\[([\s\S]*?)\]\]\s*\}\}/i;
    var targets = (contractRollStructure(instance).match(new RegExp(tr.source, 'gi')) || []).map(function (candidate) {
      return candidate.match(tr);
    }).filter(function (candidate) {
      var ref = candidate[1].match(/^\s*@\{([^{}|]+)\}\s*$/);
      var field = ref && (sourceFields[trim(ref[1])] || runtimeIndex.fieldGlobal[trim(ref[1])]);
      return !field || !/^checkbox$/i.test(trim(field.type));
    });
    for (var targetIndex = 0; targetIndex < targets.length; targetIndex++) {
      var m = qualifyContractMacro(characterId, Object.assign({}, instance, {
        roll: Object.assign({}, instance.roll, { raw: targets[targetIndex][0] }),
      }), null);
      if (m && m.ok) {
        var v = m.content.match(tr);
        var n = v && resolvedResourceValue(characterId, v[1].replace(/\[\[/g, '(').replace(/\]\]/g, ')'));
        if (n && n.number !== null) return n.text;
      }
    }
    if (!targets.length && contractRollDamageText(characterId, instance)) return '';
    var values = [];
    var seenRefs = dictionary();
    var seenValues = dictionary();
    var ignored = dictionary();
    var sourceControls = runtimeIndex.rollControls[instance.roll.key] || runtimeIndex.controls;
    var savedAttributes = data.attributeByName || dictionary();
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
        var resource = data.resourcesByAttribute && data.resourcesByAttribute[fullName];
        var property = valueType === 'max' ? 'max' : 'value';
        var field = sourceFields[name] || runtimeIndex.fieldGlobal[name];
        if (field && /^(?:checkbox|radio)$/i.test(trim(field.type))) return match;
        var fallback = field && field[valueType === 'max' ? 'max' : 'default'];
        if ((fallback === undefined || fallback === null || trim(fallback) === '') && valueType !== 'max') {
          var control = sourceControls[name] || runtimeIndex.controls[name];
          fallback = control && control.default;
        }
        var stored = savedAttributes[fullName];
        var live = stored ? null : getAttr(characterId, fullName, valueType || 'current');
        var raw = resource && own(resource, property) && resource[property] !== null
          ? resource[property]
          : stored ? stored.get(valueType === 'max' ? 'max' : 'current')
            : field && field.numericCandidate && !field.hidden && !field.readonly && !field.disabled &&
              fallback !== undefined && fallback !== null && trim(fallback) !== ''
              ? contractUnsavedFieldValue(field, live, fallback, valueType === 'max') : live;
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

  function contractRollDamageText(characterId, instance) {
    var qualified = qualifyContractMacro(characterId, instance, null);
    if (!qualified.ok && qualified.reason !== 'query') return '';
    var fields = messageTemplateFields({ content: qualified.content });
    var name = Object.keys(fields).filter(function (key) {
      return /^(?:피해|damage|dmg)(?:[_-]roll)?$/i.test(trim(key));
    })[0];
    var value = trim(name && fields[name]);
    var inline = value.match(/^\[\[([\s\S]*)\]\]$/);
    return trim(inline ? inline[1] : value);
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
    if (usableContractInspection(data.contractMatch)) {
      var rolls = preferredContractRolls(data, true);
      var counts = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (key) counts[key] = (counts[key] || 0) + 1;
      });
      var seen = dictionary();
      rolls.forEach(function (instance) {
        var key = normalize(instance.label);
        if (!key || seen[key]) return;
        seen[key] = true;
        result.push({
          kind: 'contract',
          label: instance.label,
          aliases: instance.aliases || [],
          value: contractRollDisplayValue(data, instance),
          modes: sortedUnique((instance.modes || []).reduce(function (labels, mode) {
            return labels.concat(contractUserModeLabels(mode));
          }, [])),
          command: contractSelectionCommand(data.characterId, instance, counts[key], false),
        });
      });
    }
    return result.sort(function (left, right) { return left.label.localeCompare(right.label); });
  }

  function statusModeEntries(characterId, instance) {
    var groups = dictionary();
    var candidates = contractModeCandidates(instance, true);
    var current = currentContractModes(characterId, instance);
    var category = rollInstanceStatusCategory(instance);
    if (current.length && category === 'combat') candidates = candidates.filter(function (candidate) {
      return current.indexOf(candidate.mode) > -1 || contractUserModeLabels(candidate.mode).some(function (label) {
        return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label));
      });
    });
    candidates.forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      var parts = labels.join(' | ').split(/\s*(?:\|\||::|[|｜/>])\s*/).map(normalize).filter(Boolean);
      var key = parts.length ? parts[parts.length - 1] : trim(candidate.mode && candidate.mode.id);
      if (!groups[key]) groups[key] = [];
      groups[key].push(candidate);
    });
    var selected = [];
    Object.keys(groups).forEach(function (key) {
      selected = selected.concat(preferCurrentModeContext(characterId, groups[key]));
    });
    var result = [];
    uniqueContractCandidates(selected).forEach(function (candidate) {
      var labels = contractUserModeLabels(candidate.mode).map(contractDisplayLabel).filter(Boolean);
      labels.filter(function (label) {
        var key = normalize(label);
        if (labels.some(function (other) {
          return /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(other));
        }) && /^\d+\s*개(?:\s|$)/.test(label) &&
            !contractDisplayLabel(label.replace(/^\d+\s*개\s*/, ''))) return false;
        return !/(?:보너스|패널티|페널티|bonus|penalty)/i.test(key) || !labels.some(function (other) {
          var otherKey = normalize(other);
          return otherKey.indexOf(key) === 0 && /^\+?\d+(?:개)?$/.test(otherKey.slice(key.length));
        });
      }).forEach(function (label) {
        result.push({
          id: trim(candidate.mode.id), label: label,
          modifier: /(?:보너스|패널티|페널티|bonus|penalty)/i.test(normalize(label)),
        });
      });
    });
    return result;
  }

  function statusRollIdentity(instance) {
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    var source = trim(roll.name) ? 'name:' + trim(roll.name) : 'raw:' + String(roll.raw || '');
    return JSON.stringify([
      instance && instance.contract && instance.contract.id || '',
      roll.kind || 'contract',
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
      source,
      instance && instance.modes || [],
    ]);
  }

  function statusRollLabelIdentity(instance) {
    if (!rollStatusLabel(instance)) return '';
    var roll = instance && instance.roll || {};
    var repeating = contractRepeating(roll);
    return JSON.stringify([
      normalize(rollStatusLabel(instance)),
      repeating && repeating.section || '',
      instance && instance.row && instance.row.id || '',
    ]);
  }

  function statusRollItems(data, includeEveryInstance) {
    var result = [];
    var counts = dictionary();
    var seen = dictionary();
    var seenLabels = dictionary();
    if (!usableContractInspection(data.contractMatch)) return result;
    // 같은 행이 원본 정렬에 여러 번 있으면 유지하고, 그 행의 보조 버튼만 제외합니다.
    var instances = includeEveryInstance ? data.contractRolls : preferredContractRolls(data, true);
    instances.forEach(function (instance) {
      var key = normalize(instance.label);
      if (key) counts[key] = (counts[key] || 0) + 1;
    });
    instances.forEach(function (instance) {
      var label = rollStatusLabel(instance);
      var key = statusRollIdentity(instance);
      if (!key) return;
      var modeEntries = statusModeEntries(data.characterId, instance);
      if (!includeEveryInstance && seen[key] &&
          (!instance.row || seen[key].roll.key !== instance.roll.key)) {
        seen[key].modeEntries = seen[key].modeEntries.concat(modeEntries);
        return;
      }
      var context = rollStatusContext(instance);
      var item = {
        label: label,
        value: contractRollDisplayValue(data, instance),
        command: contractSelectionCommand(data.characterId, instance, counts[normalize(instance.label)] || 1, false),
        modeEntries: modeEntries,
        groupLabels: context.groups,
        contextLabels: context.labels,
        structureLabels: context.structure,
        sourceRaw: context.sourceRaw,
        contract: instance.contract,
        roll: instance.roll,
      };
      if (!label && (!modeEntries.length || rollStatusCategory(item) !== 'madness')) return;
      if (rollStatusCategory(item) === 'other' && !/\[\[|\/(?:r|roll)\b/i.test(context.sourceRaw) &&
          sourceTemplateFieldNames(context.sourceRaw).some(function (name) {
            return /^(?:text|description|content|body)$/.test(name);
          })) return;
      if (rollStatusCategory(item) === 'combat')
        item.damage = contractRollDamageText(data.characterId, instance);
      if (!seen[key]) seen[key] = item;
      var labelKey = statusRollLabelIdentity(instance);
      if (labelKey && !seenLabels[labelKey]) seenLabels[labelKey] = item;
      result.push(item);
    });
    (data.contractAllRolls || []).forEach(function (instance) {
      if (!instance.hidden) return;
      var item = seen[statusRollIdentity(instance)] || seenLabels[statusRollLabelIdentity(instance)];
      if (item) item.modeEntries = item.modeEntries.concat(statusModeEntries(data.characterId, instance));
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
      var localModes = item.damage ? ['피해 ' + item.damage] : [];
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
    var items = recognizedRollItems(data).concat(statusResourceItems(data).map(function (item) {
      return {
        kind: 'resource', label: item.label, aliases: item.aliases,
        value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)), command: '',
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
    ['characteristic', 'check', 'combat', 'spell', 'madness'].forEach(function (key) {
      var group = groups[key];
      if (group && group.items.length) html += section(group.title + ' ' + group.items.length + '개', recognizedTable(group.items, actions));
    });
    var statusResources = statusResourceItems(data);
    if (statusResources.length) {
      var resources = statusResources.map(function (item) {
        return {
          label: item.label,
          value: fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item)),
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
    var sourceLabels = dictionary();
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
    var character = profileCharacters()[0];
    if (character) {
      (scan(character.id).contractRolls || []).forEach(function (instance) {
        var key = contractCutinKey(instance);
        if (!found[key]) {
          var seenLabels = dictionary();
          sourceLabels[key] = [instance.roll.label].concat(instance.roll.aliases || [])
            .map(contractDisplayLabel).filter(function (label) {
              var labelKey = normalize(label);
              if (!labelKey || seenLabels[labelKey] || labelKey === normalize(instance.label) ||
                  labelKey === normalize(instance.roll.name) || labelKey === normalize(instance.roll.key)) return false;
              seenLabels[labelKey] = true;
              return true;
            });
        }
        add(
          { label: instance.label, aliases: instance.aliases, command: '', type: 'contract' },
          instance.roll.kind || 'contract',
          'sheet',
          key,
          character.get('name'),
        );
      });
    }
    var items = Object.keys(found).map(function (key) { return found[key]; }).sort(function (a, b) {
      return a.label.localeCompare(b.label);
    });
    var counts = dictionary();
    var indexes = dictionary();
    var sourceLabelCounts = dictionary();
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      counts[labelKey] = (counts[labelKey] || 0) + 1;
      var labels = sourceLabelCounts[labelKey] || (sourceLabelCounts[labelKey] = dictionary());
      (sourceLabels[item.key] || []).forEach(function (label) {
        var key = normalize(label);
        labels[key] = (labels[key] || 0) + 1;
      });
    });
    items.forEach(function (item) {
      var labelKey = normalize(item.label);
      if (counts[labelKey] < 2) return;
      indexes[labelKey] = (indexes[labelKey] || 0) + 1;
      var sourceLabel = (sourceLabels[item.key] || []).filter(function (label) {
        return sourceLabelCounts[labelKey][normalize(label)] < counts[labelKey];
      })[0];
      item.displayLabel = item.label + ' (' + (sourceLabel ? sourceLabel + ' / ' : '') +
        (item.characterName || '항목') + ' ' + indexes[labelKey] + ')';
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
      '<br><b>기능 / 판정 수치 변경 알림:</b> ' + (data.trackSkillChanges ? '켜기' : '끄기') + '<br>' +
      button('켜기', '!시트 기능치알림|켜기', data.trackSkillChanges ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 기능치알림|끄기', data.trackSkillChanges ? '#53657d' : '#111') +
      '<br><b>플레이어 권한이 없는 GM 캐릭터도 알림:</b> ' + (data.trackGmOnly ? '켜기' : '끄기') + '<br>' +
      button('켜기', '!시트 GM캐릭터알림|켜기', data.trackGmOnly ? '#111' : '#53657d') + ' ' +
      button('끄기', '!시트 GM캐릭터알림|끄기', data.trackGmOnly ? '#53657d' : '#111');
    var body =
      '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:12px;background:#111;color:#fff"><b style="font-size:18px">🎲 시트 헬퍼 관리</b></div>' +
      section('설정', button('시트 다시 읽기', '!시트 새로고침', '#287a4b') + '<br><br>' + trackingControls) +
      section('캐릭터별 현황 보기', '<span style="color:#555;font-size:11px">API가 인식한 현재 캐릭터들 현황 모아보기</span><br>' + characterButtons);
    var viewed = data.managerCharacterId && scan(data.managerCharacterId);
    if (viewed && viewed.ok) {
      var hasContract = usableContractInspection(viewed.contractMatch);
      var issues = (viewed.warnings || []).slice();
      if (hasContract) {
        var modesIncomplete = viewed.contractRolls.some(function (instance) {
          return instance.roll && instance.roll.modesIncomplete === true;
        });
        if (modesIncomplete)
          issues.push('일부 선택 방식은 안전하게 실행할 수 없어 생략했습니다. 해당 굴림은 시트에서 직접 실행해 주세요.');
        body += recognizedTablesHtml(viewed, false);
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
    return String(text == null ? '' : text).replace(/([@%])\{/g, function (_, prefix) {
      return '&#' + prefix.charCodeAt(0) + ';{';
    });
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
      '<code>!!기능치알림 켜기|끄기</code> 기능 / 판정 수치 변경 알림 설정<br>' +
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
    var statusResources = statusResourceItems(data);
    if (statusResources.length)
      body += section('현재 수치 ' + statusResources.length + '개', statusResources.map(function (item) {
        return escapeHtml(item.label) + ' <b>' + escapeHtml(fieldValueText(data.characterId, item, resourceRawValue(data.characterId, item))) + '</b>';
      }).join(', '));
    return body + '<div style="padding:8px 10px;color:#555;font-size:11px">항목을 좁혀 보려면 <code>!!검색 이름</code>을 입력하세요.</div></div>';
  }

  function inspectionHtml(data) {
    var recognition = data.contractMatch || {};
    var incomplete = usableContractInspection(data.contractMatch)
      ? (data.contractRolls || []).filter(function (instance) { return instance.roll && instance.roll.modesIncomplete === true; }).length
      : 0;
    var issues = (data.warnings || []).slice();
    if (incomplete) issues.push('선택 방식을 전부 안전하게 읽지 못한 굴림 ' + incomplete + '개');
    if (recognition.contractCount && !usableContractInspection(recognition))
      issues.push('설치된 시트 인식 정보가 방의 저장 항목과 일치하지 않습니다.');
    var matched = usableContractInspection(recognition);
    return '<div style="font-family:Arial,sans-serif;background:#fff;color:#111"><div style="padding:8px 10px;background:#111;color:#fff"><b>' +
      escapeHtml(data.characterName) + ' / GM 인식 점검</b></div>' +
      section('인식 결과', matched
        ? '<b>인식 완료</b> / 현재 캐릭터의 굴림 ' + data.contractRolls.length + '개 / 수치 ' + statusResourceItems(data).length + '개'
        : SHEET_NOT_RECOGNIZED) +
      (matched ? recognizedTablesHtml(data, false, true) : '') +
      section('확인할 항목', issues.length ? issues.map(escapeHtml).join('<br>') : '<span style="color:#287a4b">확인할 문제가 없습니다.</span>') +
      '</div>';
  }

  function nativeQueryButton(label, content) {
    // Keep Roll20's nested questions; do not execute encoded commands on the client.
    var checked = String(content || '');
    var entities = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };
    for (var depth = 0; depth < 8; depth++) {
      var decoded = checked.replace(/&(amp|lt|gt|quot|apos|nbsp);|&#(x[0-9a-f]+|\d+);/gi, function (token, name, code) {
        return name ? entities[name.toLowerCase()] : String.fromCharCode(parseInt(code.replace(/^x/i, ''), /^x/i.test(code) ? 16 : 10));
      });
      if (decoded === checked) break;
      checked = decoded;
    }
    if (!checked || /[\x00-\x1f!]|[@%]\{|(?:^|[\s,|])#\S|&(?:[a-z][a-z0-9]+|#(?:x[0-9a-f]+|\d+));/i.test(checked)) return '';
    var command = escapeHtml(content).replace(/[\/:\?@%\[\]()*_~\x60]/g, function (character) {
      return '&#' + character.charCodeAt(0) + ';';
    });
    return button(label + ' / 질문 열기', '!', '#111').replace('href="!"', function () {
      // Slash in the no-op API line prevents template colons being treated as a URL scheme.
      return 'href="!/&#13;' + command + '"';
    });
  }

  function reportResult(msg, result) {
    if (result && result.ok === false)
      whisper(msg, result.reason === 'conflict' && result.choices ? bangBangChoiceHtml(result.choices)
        : result.reason === 'query' && result.queryContent
          ? nativeQueryButton(result.queryLabel, result.queryContent) || escapeHtml(result.error)
          : escapeHtml(result.error));
    else if (result && result.queryOnly)
      whisper(msg, '<b>' + escapeHtml(result.weapon.label) + '</b> 탄약: ' + escapeHtml(result.value === '' ? '-' : result.value));
    return result;
  }

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
    var primary = exact.filter(function (item) {
      return normalize(item.label) === wanted || normalize(item.name) === wanted;
    });
    if (primary.length === 1) return { ok: true, item: primary[0] };
    if (exact.length > 1)
      return { ok: false, error: '같은 이름의 수치가 여러 개입니다: ' + exact.map(function (item) { return item.label; }).join(', ') };
    var roles = ['health', 'magicPoints', 'sanity', 'startingSanity'].filter(function (role) {
      return (DETECTED_ROLE_LABELS[role] || []).indexOf(wanted) > -1;
    });
    if (roles.length === 1) {
      var detected = detectedFieldRole(data, roles[0], 'resource');
      if (detected.item) return { ok: true, item: detected.item };
    }
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

  function sanityValueText(characterId, item, current, hideMaximum) {
    var data = scan(characterId);
    var sanity = detectedFieldRole(data, 'sanity', 'number');
    if (!sanity.item || sanity.item.name !== item.name) return '';
    var starting = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = starting.item && numericFieldValue(characterId, resourceRawValue(characterId, starting.item));
    var hasStarting = starting.item && starting.item.name !== item.name && startingValue > 0;
    var hasStartingField = starting.matches.length || sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return (candidate.contract.fields || []).some(function (field) {
        var labels = [field.label].concat(field.aliases || []);
        return matchesDetectedRole(labels, 'startingSanity') ||
          linkedStartingSanityField(field, sanity.item.name, labels);
      });
    });
    var text = String(current);
    if (hasStarting)
      text += ' / 시작 ' + startingValue +
        ' (' + Math.round((current / startingValue) * 100) + '%)';
    else
      text += starting.ambiguous ? ' / 시작 확인 필요' : hasStartingField ? ' / 시작 미입력' : ' / 시작 항목 없음';
    if (!hideMaximum && sanity.item.max !== null) text += ' / 최대 ' + sanity.item.max;
    return text;
  }

  function fieldValueText(characterId, item, raw, hideSanityMaximum) {
    if (item.kind === 'toggle') {
      var enabled = trim(item.onValue) ? trim(raw) === trim(item.onValue) : toggleValue(raw);
      return enabled === null ? trim(raw) : enabled ? '활성화' : '해제';
    }
    var current = numericFieldValue(characterId, raw);
    if (current === null) return trim(raw);
    var sanityText = sanityValueText(characterId, item, current, hideSanityMaximum);
    if (sanityText) return sanityText;
    return item.max !== null && item.max > 0
      ? current + ' / ' + item.max + ' (' + Math.round((current / item.max) * 100) + '%)'
      : String(current);
  }

  function resourceRawValue(characterId, item) {
    if (!item) return undefined;
    if (item.attribute) return item.attribute.get('current');
    var current = getAttr(characterId, item.name);
    return current === undefined || current === null ? item.value : current;
  }

  function resourceChangeContent(character, item, before, current, detail) {
    var beforeText = fieldValueText(character.id, item, before, true);
    var currentText = fieldValueText(character.id, item, current, true);
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    var delta = beforeNumber !== null && currentNumber !== null ? currentNumber - beforeNumber : 0;
    var deltaText = !delta || item.kind === 'toggle' ? ''
      : ' <span style="color:#aaa">(' + escapeHtml(Math.abs(delta)) + (delta > 0 ? ' 증가' : ' 감소') + ')</span>';
    var detailText = detail ? '<br><span style="color:#aaa">' + escapeHtml(detail) + '</span>' : '';
    return '<span style="font-size:10px;line-height:1.35;color:#969696"><b>' + escapeHtml(character.get('name')) + ' / ' + escapeHtml(item.label) +
      '</b> <span style="color:#b8b8b8">' + escapeHtml(beforeText) + '</span> → <b>' + escapeHtml(currentText) +
      '</b>' + deltaText + detailText + '</span>';
  }

  function trackedSkillField(data, item) {
    if (!data || !item || item.statusResource === true || own(item, 'max') && item.max !== null ||
      matchesDetectedRole([item.label, item.fieldLabel], 'characteristic')) return false;
    return preferredContractRolls(data, true).some(function (instance) {
      if (rollInstanceStatusCategory(instance) !== 'check') return false;
      var found = false;
      String(contractRollStructure(instance)).replace(/@\{([^{}|]+)(?:\|max)?\}/g, function (token, name) {
        if (contractRowAttr(instance.contract, instance.roll, instance.row, trim(name)) === item.name) found = true;
        return token;
      });
      return found;
    });
  }

  function sendTrackedChange(character, item, before, current, detail, scannedData) {
    if (item.kind === 'toggle' &&
      fieldValueText(character.id, item, before) === fieldValueText(character.id, item, current)) return false;
    var settings = initState();
    if (settings.trackingMode === 'off') return false;
    if (!settings.trackSkillChanges && trackedSkillField(scannedData || scan(character.id), item)) return false;
    if (!settings.trackGmOnly && !hasPlayerController(character)) return false;
    var content = resourceChangeContent(character, item, before, current, detail);
    sendChat(settings.trackingMode === 'gm' ? '시트 헬퍼' : '',
      settings.trackingMode === 'gm' ? '/w gm ' + content : '/desc ' + content, null);
    return true;
  }

  function suppressKey(characterId, name) {
    return characterId + '|' + name;
  }

  function setResourceValue(characterId, item, value) {
    if (item.writable === false)
      return { attribute: item.attribute || null, changed: false, error: '원본 시트의 읽기 전용 계산 수치는 명령으로 변경할 수 없습니다.' };
    var text = String(value);
    if (item.radioRange && (!isFinite(value) || Math.floor(Number(value)) !== Number(value) ||
        Number(value) < item.radioRange[0] || Number(value) > item.radioRange[1]))
      return { attribute: item.attribute || null, changed: false, error: '원본 시트에 없는 숫자 선택값입니다.' };
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
    if (automation.sourceHash && !sourceCandidateInspections(data.contractMatch).some(function (candidate) {
      return automation.sourceHash === candidate.contract.sourceHash;
    })) return;
    var longItem = automation.longName && data.trackedFields[automation.longName];
    if (longItem && trackedToggleEnabled(character.id, longItem)) return;
    var temporary = data.trackedFields[automation.temporaryName];
    if (!temporary || temporary.kind !== 'toggle') return;
    if (activateTrackedToggle(character, temporary, '지능 판정 성공으로 자동 활성화')) {
      invalidate(character.id);
      scheduleManager();
    }
  }

  function applyDetectedRules(character, changedItem, before, current, scannedData) {
    var data = scannedData || scan(character.id);
    var details = [];
    var beforeNumber = numericFieldValue(character.id, before);
    var currentNumber = numericFieldValue(character.id, current);
    if (beforeNumber === null || currentNumber === null || currentNumber >= beforeNumber) return details;

    var health = detectedFieldRole(data, 'health', 'number');
    var healthItem = health.item || health.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedHealth = healthItem && healthItem.name === changedItem.name;
    if (changedHealth) {
      var maximum = healthItem.max;
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
    var sanityItem = sanity.item || sanity.matches.filter(function (item) {
      return item.name === changedItem.name;
    })[0];
    var changedSanity = sanityItem && sanityItem.name === changedItem.name;
    if (!changedSanity) return details;
    var longInsanity = detectedFieldRole(data, 'longInsanity', 'toggle');
    if (longInsanity.ambiguous) {
      details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      return details;
    }
    var longActive = longInsanity.item && trackedToggleEnabled(character.id, longInsanity.item);
    var startingSanity = detectedFieldRole(data, 'startingSanity', 'number');
    var startingValue = startingSanity.item &&
      numericFieldValue(character.id, resourceRawValue(character.id, startingSanity.item));
    var longTriggered = !longActive && startingValue !== null && startingValue > 0 &&
      startingValue - currentNumber >= startingValue / 5;
    if (longTriggered) {
      if (!longInsanity.item) details.push(detectedRoleProblem(character, '장기적 광기', longInsanity));
      else if (activateTrackedToggle(character, longInsanity.item, '시작 이성의 5분의 1 이상 손실', false)) {
        details.push('장기적 광기 활성화');
        invalidate(character.id);
        scheduleManager();
      }
      longActive = true;
    }
    if (beforeNumber - currentNumber < 5) return details;
    if (longActive) return details;
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
        sourceHash: rolled.payload.sourceHash || '',
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
    var current = numericFieldValue(character.id, resourceRawValue(character.id, item));
    if (current === null) return { ok: false, error: item.label + ' 값이 숫자가 아닙니다.' };
    var next = operator === '+' ? current + amount.value : operator === '-' ? current - amount.value : amount.value;
    next = Math.round(next * 1000000) / 1000000;
    var saved = setResourceValue(character.id, item, next);
    if (saved.error) return { ok: false, error: saved.error };
    if (!saved.changed) return { ok: true, value: next, unchanged: true };
    item.attribute = saved.attribute;
    var details = amount.detail !== String(amount.value) ? [amount.detail] : [];
    details = details.concat(applyDetectedRules(character, item, current, next, data));
    sendTrackedChange(character, item, current, next, details.join(' / '), data);
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
    if (!resolved.ok || !usableContractInspection(inspectContracts(resolved.character.id))) return false;
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
    var skillTracking = body.match(/^기능치알림\s+(켜기|on|끄기|해제|off)$/i);
    if (skillTracking) {
      handleNamespaced(msg, '!시트 기능치알림|' + skillTracking[1]);
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
      if (contracted.inspection && !usableContractInspection(contracted.inspection) && contracted.inspection.status === 'ambiguous')
        return { ok: false, error: contracted.inspection.error };
      return {
        ok: false,
        error: contracted.inspection && usableContractInspection(contracted.inspection)
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
        var recognition = inspectContracts(character.id);
        if (!usableContractInspection(recognition))
          return { ok: false, error: recognition.error || SHEET_NOT_RECOGNIZED };
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
        if (!usableContractInspection(inspection))
          return { ok: false, error: inspection.error || SHEET_NOT_RECOGNIZED };
        var matches = preferredContractRolls(scan(character.id), true).filter(function (instance) {
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
    if (action === '기능치알림') {
      if (!playerIsGM(msg.playerid)) return whisper(msg, 'GM 전용 명령입니다.');
      var skillTracking = normalize(parts[0]);
      if (/^(?:켜기|on)$/.test(skillTracking)) initState().trackSkillChanges = true;
      else if (/^(?:끄기|해제|off)$/.test(skillTracking)) initState().trackSkillChanges = false;
      else return whisperGm('기능 / 판정 수치 변경 알림은 켜기 또는 끄기를 골라 주세요.');
      initState().managerHash = '';
      managerHandout();
      return whisperGm('기능 / 판정 수치 변경 알림: <b>' + (initState().trackSkillChanges ? '켜기' : '끄기') + '</b>');
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

  function trackAttributeChange(attribute, previous, scannedData) {
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
    var data = scannedData || scan(characterId);
    var item = data.trackedFields && data.trackedFields[name];
    if (!item) return;
    item = data.resourcesByAttribute && data.resourcesByAttribute[name] || item;
    var character = getObj('character', characterId);
    if (!character) return;
    var details = applyDetectedRules(character, item, before, current, data);
    sendTrackedChange(character, item, before, current, details.join(' / '), data);
  }

  function cachedUntrackedToggle(characterId, name) {
    var data = cache[characterId];
    var candidates = data && sourceCandidateInspections(data.contractMatch);
    if (!candidates || !candidates.length || data.trackedFields && data.trackedFields[name]) return false;
    return candidates.every(function (candidate) {
      var field = contractRuntimeIndex(candidate.contract).fieldGlobal[name];
      return !!(field && /^(?:checkbox|radio)$/i.test(trim(field.type)));
    });
  }

  function flushAttributeChanges() {
    attributeChangeTimer = null;
    var changes = pendingAttributeOrder.map(function (key) { return pendingAttributeChanges[key]; });
    pendingAttributeChanges = {};
    pendingAttributeOrder = [];
    if (!changes.length) return;

    var allMembershipChanged = changes.some(function (change) { return change.membershipChanged; });
    var affected = {};
    changes.forEach(function (change) { affected[change.characterId] = true; });
    if (allMembershipChanged) invalidate();
    else Object.keys(affected).forEach(function (characterId) { invalidate(characterId); });

    var scanned = {};
    changes.forEach(function (change) {
      if (!change.previous || change.presentationOnly ||
        change.membershipChanged && change.previous.current === undefined) return;
      var data = scanned[change.characterId];
      if (!data) data = scanned[change.characterId] = scan(change.characterId);
      if (!data.ok || cachedUntrackedToggle(change.characterId, change.name)) return;
      trackAttributeChange(change.attribute, change.previous, data);
    });
    scheduleManager();
  }

  function onAttributeChanged(attribute, previous, membershipChanged) {
    var name = trim(attribute && attribute.get('name'));
    var characterId = attribute && attribute.get('_characterid');
    membershipChanged = !!membershipChanged || !!(previous && own(previous, 'name') && trim(previous.name) !== name);
    if (!characterId || (!membershipChanged && !contractRelevant(name))) return;
    var key = characterId + '|' + name;
    var pending = pendingAttributeChanges[key];
    var presentationOnly = !membershipChanged && cachedUntrackedToggle(characterId, name);
    invalidate(characterId);
    if (!pending) {
      pending = pendingAttributeChanges[key] = {
        attribute: attribute,
        previous: previous,
        membershipChanged: membershipChanged,
        presentationOnly: presentationOnly,
        characterId: characterId,
        name: name,
      };
      pendingAttributeOrder.push(key);
    } else {
      pending.attribute = attribute;
      if (!pending.previous && previous) pending.previous = previous;
      pending.membershipChanged = pending.membershipChanged || membershipChanged;
      pending.presentationOnly = pending.presentationOnly && presentationOnly;
    }
    if (attributeChangeTimer) clearTimeout(attributeChangeTimer);
    attributeChangeTimer = setTimeout(flushAttributeChanges, 25);
  }

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
    return commonContractRolls(characterId, inspectContracts(characterId), false);
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
        '<code>!!기능치알림 켜기|끄기</code> 기능 / 판정 수치 변경 알림 설정',
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
    invalidate();
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
