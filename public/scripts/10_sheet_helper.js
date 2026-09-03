/*
 * Scene Suite 10 - Sheet Helper 0.6.48
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
  if (compressed.length !== 300780 || !/^[A-Za-z0-9+/]+={0,2}$/.test(compressed))
    throw new Error('Invalid embedded sheet data.');
  var decoded = DecodeBrotliJson(compressed);
  if (decoded.length !== 4759645) throw new Error('Invalid embedded sheet data length.');
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

  var VERSION = '0.6.48';
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
        probes.push({ name: name, value: '', matches: [] });
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
              if (!field.section && field.name === name)
                alternatives = alternatives.concat(field.defaultVariants || []);
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
    return trim(field && field.defaultVariants
      ? contractUnsavedFieldValue(field, value, field.default, ref && ref.max) : value);
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
      var positiveValues = polarity ? Object.keys(polarity.positiveValues || {}) : [];
      var onValue = field && own(field, 'onValue') ? String(field.onValue) : '';
      var positiveCollapsedPanel = polarity && polarity.positive && !polarity.negative &&
        polarity.positiveEqualityOnly && positiveValues.length === 1 &&
        (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length &&
        field && trim(field.default) === '' && onValue !== '' && positiveValues[0] === onValue;
      if ((polarity && polarity.negative && !polarity.positive &&
          (index.rollVisibilityReach[name] || 0) * 2 > contract.rolls.length) ||
          positiveCollapsedPanel)
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
      // 실행 주소에는 prefix가 없으므로 서로 다른 물리 그룹의 같은 ID는 선택하지 않습니다.
      rowsBySection[sectionName] = rows.filter(function (row) { return !conflicts[row.id]; });
    });
    var character = getObj('character', characterId);
    var characterName = normalize(character && character.get('name'));
    var result = [];
    contract.rolls.forEach(function (roll) {
      if (!roll || !roll.key || !roll.raw) return;
      if (roll.visibility && roll.visibility.never === true) return;
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
        // Explicit bonus/private modes may use hidden dice buttons, never an inactive worker panel.
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
          if (titleRefs[refName] && value && !titleValue) titleValue = value;
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
      // A literal HTML input limit is not the character's resource maximum.
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

  function preferredContractRolls(data) {
    // 일반/보너스 짝을 먼저 고른 뒤 시트 후보 간 동등화를 해야 짝이 유실되지 않습니다.
    var instances = actionableContractRolls(data.characterId, data.contractMatch, false);
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
      return qualified.ok ? qualified.content : reference;
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
    if (!/\b(?:\d+)?d100/i.test(raw) || !/@\{[^}]+\}/.test(raw)) return false;
    return sourceTemplateFieldNames(raw).some(function (name) {
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
    var targets = (String(instance.roll.raw).match(new RegExp(tr.source, 'gi')) || []).map(function (candidate) {
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
    if (!qualified.ok) return '';
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
      var rolls = preferredContractRolls(data);
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
    var context = rollStatusContext(instance);
    var category = rollStatusCategory({
      label: rollStatusLabel(instance), groupLabels: context.groups, contextLabels: context.labels,
      structureLabels: context.structure, sourceRaw: context.sourceRaw, contract: instance.contract, roll: instance.roll,
    });
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
    var instances = includeEveryInstance ? data.contractRolls : preferredContractRolls(data);
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

  function reportResult(msg, result) {
    if (result && result.ok === false)
      whisper(msg, result.reason === 'conflict' && result.choices ? bangBangChoiceHtml(result.choices) : escapeHtml(result.error));
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

  function sendTrackedChange(character, item, before, current, detail) {
    if (item.kind === 'toggle' &&
      fieldValueText(character.id, item, before) === fieldValueText(character.id, item, current)) return false;
    var settings = initState();
    if (settings.trackingMode === 'off') return false;
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
        var matches = preferredContractRolls(scan(character.id)).filter(function (instance) {
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
    sendTrackedChange(character, item, before, current, details.join(' / '));
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
